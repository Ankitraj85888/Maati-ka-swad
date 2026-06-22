import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DeliveryAddress.css';

const ADDR_KEY = 'mks_saved_address';

const inputIcons = {
  fullName: '👤',
  mobile: '📞',
  pincode: '📍',
  state: '🗺️',
  city: '🏙️',
  area: '🏘️',
  fullAddress: '🏠',
  landmark: '🎯',
};

export default function DeliveryAddress() {
  const [savedAddr, setSavedAddr] = useState(null);
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const emptyForm = {
    fullName: '', mobile: '', pincode: '', state: '', city: '', area: '',
    fullAddress: '', landmark: '', addressType: 'home',
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [pincodeTouched, setPincodeTouched] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADDR_KEY);
      if (stored) setSavedAddr(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (justSaved && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [justSaved]);

  const setF = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
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
    setF('city', e.target.value);
    setF('area', '');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = 'Enter a valid 10-digit number';
    if (!form.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    if (!form.state.trim()) newErrors.state = 'Enter a valid pincode first';
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
    if (savedAddr) setForm(savedAddr);
    setEditing(true);
    setJustSaved(false);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setErrors({});
    setEditing(true);
    setJustSaved(false);
  };

  // ────────── Saved address view ──────────
  if (savedAddr && !editing && !justSaved) {
    return (
      <div className="delivery-page">
        <div className="mithila-lotus-bg" />
        <div className="delivery-container" ref={formRef}>
          <div className="delivery-header">
            <span className="header-badge">📍 Address</span>
            <h1>Your Delivery Address</h1>
            <p>Manage your saved address</p>
          </div>

          <div className="delivery-saved">
            <div className="saved-card">
              <div className="saved-card-top">
                <span className={`saved-type-tag ${savedAddr.addressType}`}>
                  {savedAddr.addressType === 'home' ? '🏠' : '🏢'} {savedAddr.addressType === 'home' ? 'Home' : 'Work'}
                </span>
                <span className="saved-default-badge">✓ Default</span>
              </div>

              <div className="saved-details">
                <p className="saved-name">{savedAddr.fullName}</p>
                <p className="saved-mobile">📞 {savedAddr.mobile}</p>
                <div className="saved-divider" />
                <p className="saved-address-line">{savedAddr.fullAddress}</p>
                <p className="saved-address-line">{savedAddr.area}, {savedAddr.city}</p>
                <p className="saved-address-line">{savedAddr.state} — {savedAddr.pincode}</p>
                {savedAddr.landmark && <p className="saved-landmark">📍 {savedAddr.landmark}</p>}
              </div>

              <div className="saved-actions">
                <button onClick={handleEdit} className="saved-btn outline">
                  ✏️ Edit
                </button>
                <button onClick={handleAddNew} className="saved-btn outline">
                  ➕ Add New
                </button>
              </div>

              <Link to="/checkout" className="saved-checkout-btn">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ────────── Just saved success ──────────
  if (justSaved && savedAddr) {
    return (
      <div className="delivery-page">
        <div className="mithila-lotus-bg" />
        <div className="delivery-container" ref={formRef}>
          <div className="delivery-header">
            <span className="header-badge">✅ Saved</span>
            <h1>Address Saved!</h1>
            <p>Your delivery address has been saved successfully</p>
          </div>

          <div className="delivery-success">
            <div className="success-animation">
              <div className="success-circle">
                <span className="success-check">✓</span>
              </div>
            </div>
            <h2 className="success-title">Address Saved Successfully</h2>
            <p className="success-sub">You can now proceed to checkout or edit your address</p>

            <div className="saved-card success-mini-card">
              <div className="saved-details">
                <p className="saved-name">{savedAddr.fullName}</p>
                <p className="saved-address-line">{savedAddr.fullAddress}</p>
                <p className="saved-address-line">{savedAddr.city}, {savedAddr.state} — {savedAddr.pincode}</p>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/checkout" className="success-checkout-btn">
                Proceed to Checkout →
              </Link>
              <button onClick={handleEdit} className="success-edit-btn">
                ✏️ Edit This Address
              </button>
              <Link to="/cart" className="success-back-btn">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ────────── Form view ──────────
  return (
    <div className="delivery-page">
      <div className="mithila-lotus-bg" />
      <div className="delivery-container" ref={formRef}>
        <div className="delivery-header">
          <span className="header-badge">
            {savedAddr ? '✏️ Edit' : '📍 New'}
          </span>
          <h1>{savedAddr ? 'Edit Address' : 'Delivery Address'}</h1>
          <p>Fill in your delivery details below</p>
        </div>

        <form className="delivery-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <InputField
              id="fullName" label="Full Name" icon={inputIcons.fullName}
              value={form.fullName} onChange={v => setF('fullName', v)}
              placeholder="Enter full name" error={errors.fullName}
            />
            <InputField
              id="mobile" label="Mobile Number" icon={inputIcons.mobile}
              value={form.mobile} onChange={v => setF('mobile', v.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile" error={errors.mobile}
              type="tel" maxLength={10}
            />
          </div>

          <InputField
            id="pincode" label="Pincode" icon={inputIcons.pincode}
            value={form.pincode}
            onChange={v => {
              const val = v.replace(/\D/g, '').slice(0, 6);
              setF('pincode', val);
              if (!pincodeTouched) setPincodeTouched(true);
            }}
            placeholder="Enter 6-digit pincode" error={errors.pincode || pincodeError}
            maxLength={6}
            loading={pincodeLoading}
            helper="Enter pincode to auto-fill city & state"
          />

          <InputField
            id="state" label="State" icon={inputIcons.state}
            value={form.state} readOnly
            placeholder="Auto-filled from pincode" error={errors.state}
            readonly
          />

          <div className="form-row">
            <SelectField
              id="city" label="City / District" icon={inputIcons.city}
              value={form.city} onChange={handleCityChange}
              options={cityOptions} placeholder="Select city / district"
              error={errors.city} manualPlaceholder="Enter city or district"
              manualValue={form.city} onManualChange={v => setF('city', v)}
            />
            <SelectField
              id="area" label="Area / Post Office" icon={inputIcons.area}
              value={form.area} onChange={v => setF('area', v.target ? v.target.value : v)}
              options={areaOptions} placeholder="Select area / post office"
              error={errors.area} manualPlaceholder="Enter area or post office"
              manualValue={form.area} onManualChange={v => setF('area', v)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">
              <span className="field-icon">{inputIcons.fullAddress}</span>
              Full Address <span className="required">*</span>
            </label>
            <textarea
              id="fullAddress"
              placeholder="House / Flat / Building No., Street, Locality"
              value={form.fullAddress}
              onChange={e => setF('fullAddress', e.target.value)}
              rows={3}
              className={`${errors.fullAddress ? 'input-error' : ''} has-icon`}
            />
            {errors.fullAddress && <span className="error-text">{errors.fullAddress}</span>}
          </div>

          <InputField
            id="landmark" label="Landmark" icon={inputIcons.landmark}
            value={form.landmark} onChange={v => setF('landmark', v)}
            placeholder="E.g. near school, opposite mall"
            optional
          />

          <div className="form-group">
            <label>
              <span className="field-icon">🏷️</span>
              Address Type <span className="required">*</span>
            </label>
            <div className="address-type-group">
              {[
                { value: 'home', icon: '🏠', label: 'Home' },
                { value: 'work', icon: '🏢', label: 'Work' },
              ].map(t => (
                <label
                  key={t.value}
                  className={`type-option ${form.addressType === t.value ? 'active' : ''}`}
                >
                  <input
                    type="radio" name="addressType" value={t.value}
                    checked={form.addressType === t.value}
                    onChange={e => setF('addressType', e.target.value)}
                  />
                  <span className="type-icon">{t.icon}</span>
                  <span className="type-label">{t.label}</span>
                  {form.addressType === t.value && <span className="type-check">✓</span>}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <span className="btn-text">{savedAddr ? 'Update Address' : 'Save Address'}</span>
            <span className="btn-arrow">→</span>
          </button>

          <Link to="/cart" className="back-link">← Back to Cart</Link>
        </form>
      </div>
    </div>
  );
}

function InputField({ id, label, icon, value, onChange, placeholder, error, type = 'text', maxLength, readonly, loading, optional, helper }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {icon && <span className="field-icon">{icon}</span>}
        {label}
        {optional ? <span className="optional"> (optional)</span> : <span className="required">*</span>}
      </label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={id} type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={maxLength}
          readOnly={readonly}
          className={`${error ? 'input-error' : ''} ${icon ? 'has-icon' : ''} ${readonly ? 'input-readonly' : ''}`}
        />
        {loading && <span className="input-spinner" />}
      </div>
      {helper && !error && <span className="helper-text">{helper}</span>}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

function SelectField({ id, label, icon, value, onChange, options, placeholder, error, manualPlaceholder, manualValue, onManualChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>
        {icon && <span className="field-icon">{icon}</span>}
        {label} <span className="required">*</span>
      </label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        {options.length > 0 ? (
          <select
            id={id}
            value={value}
            onChange={onChange}
            className={`${error ? 'input-error' : ''} has-icon`}
          >
            <option value="">{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            id={id}
            type="text"
            placeholder={manualPlaceholder}
            value={manualValue}
            onChange={e => onManualChange(e.target.value)}
            className={`${error ? 'input-error' : ''} has-icon`}
          />
        )}
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
