import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DeliveryAddress.css';

const ADDR_KEY = 'mks_saved_address';

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const [savedAddr, setSavedAddr] = useState(null);
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const emptyForm = {
    fullName: '',
    mobile: '',
    pincode: '',
    state: '',
    city: '',
    area: '',
    fullAddress: '',
    landmark: '',
    addressType: 'home',
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [pincodeTouched, setPincodeTouched] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADDR_KEY);
      if (stored) {
        setSavedAddr(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const setF = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  useEffect(() => {
    if (form.pincode.length !== 6 || !/^\d{6}$/.test(form.pincode)) {
      if (pincodeTouched) {
        setPincodeError('Pincode must be exactly 6 digits');
        setForm(prev => ({ ...prev, state: '', city: '', area: '' }));
        setCityOptions([]);
        setAreaOptions([]);
      }
      return;
    }

    const fetchPincode = async () => {
      setPincodeLoading(true);
      setPincodeError('');
      setCityOptions([]);
      setAreaOptions([]);
      setForm(prev => ({ ...prev, state: '', city: '', area: '' }));

      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
        const data = await res.json();

        if (!data || data[0].Status === 'Error' || !data[0].PostOffice) {
          setPincodeError('Invalid pincode. Please enter a valid 6-digit pincode.');
          return;
        }

        const postOffices = data[0].PostOffice;
        const state = postOffices[0].Circle;
        const cities = [...new Set(postOffices.map(p => p.District))];
        const areas = postOffices.map(p => p.Name);

        setForm(prev => ({ ...prev, state }));
        setCityOptions(cities);
        setAreaOptions(areas);
      } catch {
        setPincodeError('Failed to fetch pincode data. Please try again.');
      } finally {
        setPincodeLoading(false);
      }
    };

    fetchPincode();
  }, [form.pincode]);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setF('city', city);
    setF('area', '');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    if (!form.state.trim()) newErrors.state = 'State is required (enter a valid pincode)';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.area.trim()) newErrors.area = 'Area is required';
    if (!form.fullAddress.trim()) newErrors.fullAddress = 'Full address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const address = { ...form, savedAt: Date.now() };
    localStorage.setItem(ADDR_KEY, JSON.stringify(address));
    setSavedAddr(address);
    setJustSaved(true);
    setEditing(false);
  };

  const handleEdit = () => {
    if (savedAddr) {
      setForm(savedAddr);
    }
    setEditing(true);
    setJustSaved(false);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setErrors({});
    setEditing(true);
    setJustSaved(false);
  };

  if (savedAddr && !editing && !justSaved) {
    return (
      <div className="delivery-page">
        <div className="delivery-container">
          <div className="delivery-header">
            <h1>Your Address</h1>
            <p>Manage your delivery address</p>
          </div>
          <div className="delivery-saved">
            <div className="saved-badge">{savedAddr.addressType === 'home' ? '🏠' : '🏢'} {savedAddr.addressType === 'home' ? 'Home' : 'Work'}</div>
            <div className="saved-details">
              <p className="saved-name">{savedAddr.fullName}</p>
              <p className="saved-mobile">📞 {savedAddr.mobile}</p>
              <p className="saved-address">{savedAddr.fullAddress}</p>
              <p className="saved-city">{savedAddr.area}, {savedAddr.city}, {savedAddr.state} - {savedAddr.pincode}</p>
              {savedAddr.landmark && <p className="saved-landmark">📍 {savedAddr.landmark}</p>}
            </div>
            <div className="saved-actions">
              <button onClick={handleEdit} className="saved-edit-btn">✏️ Edit Address</button>
              <button onClick={handleAddNew} className="saved-new-btn">➕ Add New Address</button>
            </div>
            <Link to="/checkout" className="saved-checkout-link">Proceed to Checkout →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-page">
      <div className="delivery-container">
        <div className="delivery-header">
          <h1>{savedAddr ? 'Edit Address' : 'Delivery Address'}</h1>
          <p>Enter your delivery details to continue</p>
        </div>

        <form className="delivery-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name <span className="required">*</span></label>
              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={e => setF('fullName', e.target.value)}
                className={errors.fullName ? 'input-error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number <span className="required">*</span></label>
              <input
                id="mobile"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={form.mobile}
                onChange={e => setF('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                className={errors.mobile ? 'input-error' : ''}
              />
              {errors.mobile && <span className="error-text">{errors.mobile}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode <span className="required">*</span></label>
            <div className="pincode-wrapper">
              <input
                id="pincode"
                type="text"
                placeholder="Enter 6-digit pincode"
                value={form.pincode}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setF('pincode', val);
                  if (!pincodeTouched) setPincodeTouched(true);
                }}
                maxLength={6}
                className={errors.pincode || pincodeError ? 'input-error' : ''}
              />
              {pincodeLoading && <span className="pincode-loading">Fetching...</span>}
            </div>
            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            {pincodeError && <span className="error-text">{pincodeError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="state">State <span className="required">*</span></label>
            <input
              id="state"
              type="text"
              placeholder="Auto-filled from pincode"
              value={form.state}
              readOnly
              className="input-readonly"
            />
            {errors.state && <span className="error-text">{errors.state}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City / District <span className="required">*</span></label>
              {cityOptions.length > 0 ? (
                <select
                  id="city"
                  value={form.city}
                  onChange={handleCityChange}
                  className={errors.city ? 'input-error' : ''}
                >
                  <option value="">Select city / district</option>
                  {cityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="city"
                  type="text"
                  placeholder="Enter city or district"
                  value={form.city}
                  onChange={e => setF('city', e.target.value)}
                  className={errors.city ? 'input-error' : ''}
                />
              )}
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="area">Area / Post Office <span className="required">*</span></label>
              {areaOptions.length > 0 ? (
                <select
                  id="area"
                  value={form.area}
                  onChange={e => setF('area', e.target.value)}
                  className={errors.area ? 'input-error' : ''}
                >
                  <option value="">Select area / post office</option>
                  {areaOptions.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              ) : (
                <input
                  id="area"
                  type="text"
                  placeholder="Enter area or post office"
                  value={form.area}
                  onChange={e => setF('area', e.target.value)}
                  className={errors.area ? 'input-error' : ''}
                />
              )}
              {errors.area && <span className="error-text">{errors.area}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">Full Address <span className="required">*</span></label>
            <textarea
              id="fullAddress"
              placeholder="House / Flat / Building No., Street, Locality"
              value={form.fullAddress}
              onChange={e => setF('fullAddress', e.target.value)}
              rows={3}
              className={errors.fullAddress ? 'input-error' : ''}
            />
            {errors.fullAddress && <span className="error-text">{errors.fullAddress}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="landmark">Landmark <span className="optional">(optional)</span></label>
            <input
              id="landmark"
              type="text"
              placeholder="E.g. near school, opposite mall"
              value={form.landmark}
              onChange={e => setF('landmark', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Address Type <span className="required">*</span></label>
            <div className="address-type-group">
              <label className={`type-option ${form.addressType === 'home' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={form.addressType === 'home'}
                  onChange={e => setF('addressType', e.target.value)}
                />
                <span className="type-icon">🏠</span>
                <span>Home</span>
              </label>
              <label className={`type-option ${form.addressType === 'work' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={form.addressType === 'work'}
                  onChange={e => setF('addressType', e.target.value)}
                />
                <span className="type-icon">🏢</span>
                <span>Work</span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {savedAddr ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  );
}
