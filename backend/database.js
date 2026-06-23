const { Pool } = require('pg');
const path     = require('path');
const bcrypt   = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/maatikaswad',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        TEXT    NOT NULL,
        email       TEXT    NOT NULL UNIQUE,
        password    TEXT    NOT NULL,
        phone       TEXT    DEFAULT '',
        role        TEXT    DEFAULT 'customer',
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id          SERIAL PRIMARY KEY,
        name        TEXT    NOT NULL,
        name_hi     TEXT    DEFAULT '',
        slug        TEXT    NOT NULL,
        category    TEXT    NOT NULL,
        price       INTEGER NOT NULL,
        mrp         INTEGER NOT NULL,
        weight      TEXT    DEFAULT '250g',
        stock       INTEGER DEFAULT 50,
        badge       TEXT    DEFAULT '',
        emoji       TEXT    DEFAULT '🍴',
        color       TEXT    DEFAULT '#D4620A',
        description TEXT    DEFAULT '',
        ingredients TEXT    DEFAULT '[]',
        rating      REAL    DEFAULT 4.5,
        reviews     INTEGER DEFAULT 0,
        images      TEXT    DEFAULT '[]',
        is_active   INTEGER DEFAULT 1,
        created_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id             SERIAL PRIMARY KEY,
        order_number   TEXT    NOT NULL UNIQUE,
        user_id        INTEGER REFERENCES users(id),
        user_name      TEXT    NOT NULL,
        user_email     TEXT    NOT NULL,
        user_phone     TEXT    DEFAULT '',
        address        TEXT    DEFAULT '',
        city           TEXT    DEFAULT '',
        state          TEXT    DEFAULT '',
        pincode        TEXT    DEFAULT '',
        payment_method TEXT    DEFAULT 'cod',
        subtotal       INTEGER DEFAULT 0,
        shipping       INTEGER DEFAULT 0,
        discount       INTEGER DEFAULT 0,
        total          INTEGER NOT NULL,
        status         TEXT    DEFAULT 'pending',
        notes          TEXT    DEFAULT '',
        created_at     TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id           SERIAL PRIMARY KEY,
        order_id     INTEGER NOT NULL REFERENCES orders(id),
        product_id   INTEGER NOT NULL REFERENCES products(id),
        product_name TEXT    NOT NULL,
        price        INTEGER NOT NULL,
        qty          INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        phone      TEXT DEFAULT '',
        subject    TEXT DEFAULT 'General Query',
        message    TEXT NOT NULL,
        status     TEXT DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS wishlists (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id),
        product_id INTEGER NOT NULL REFERENCES products(id),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );
    `);

    const { rows } = await client.query('SELECT COUNT(*) as c FROM products');
    if (parseInt(rows[0].c) === 0) {
      console.log('Seeding products...');
      const products = [
        ['Aam Ka Achar','आम का अचार','mango-pickle','pickles',149,199,'250g',48,'bestseller','🥭','#FF9A00','A timeless classic from grandmother\'s kitchen. Made with hand-picked raw mangoes, sun-dried spices, mustard oil, and a generations-old secret masala.','["Raw Mango","Mustard Oil","Salt","Fenugreek Seeds","Fennel Seeds","Red Chilli","Turmeric","Asafoetida"]',4.8,234],
        ['Mix Veg Achar','मिक्स सब्जी अचार','mix-veg-pickle','pickles',129,179,'250g',35,'new','🥗','#4CAF50','A vibrant medley of carrot, cauliflower, turnip and green chilli pickled in a tangy mustard oil base.','["Carrot","Cauliflower","Turnip","Green Chilli","Mustard Oil","Salt","Garlic","Ginger"]',4.6,187],
        ['Lehsun Ka Achar','लहसुन का अचार','garlic-pickle','pickles',159,219,'200g',22,'organic','🧄','#9B59B6','Bold, pungent, and utterly addictive. Whole garlic cloves marinated in spices and mustard oil for 15 days.','["Garlic Cloves","Mustard Oil","Red Chilli","Salt","Fenugreek","Asafoetida","Lemon Juice"]',4.7,156],
        ['Nimbu Ka Achar','नींबू का अचार','lemon-pickle','pickles',99,139,'200g',60,'','🍋','#F1C40F','Tangy, citrusy and refreshing. Whole lemons sun-cured with spiced salt for 21 days.','["Lemon","Salt","Red Chilli Powder","Turmeric","Cumin Seeds","Fenugreek","Black Pepper"]',4.5,143],
        ['Garam Masala','गरम मसाला','garam-masala','spices',89,129,'100g',75,'bestseller','🌶️','#C0392B','The soul of Indian cooking. Whole spices slow-roasted on stone-ground to preserve their essential oils and full aroma.','["Cinnamon","Cardamom","Cloves","Black Pepper","Cumin","Coriander","Bay Leaf","Nutmeg","Star Anise","Mace"]',4.9,312],
        ['Haldi Powder','हल्दी पाउडर','turmeric-powder','spices',69,99,'100g',90,'organic','💛','#F39C12','High curcumin (4%+) turmeric sourced from Erode, Tamil Nadu — the world\'s finest turmeric growing region.','["Pure Turmeric (Curcuma longa)"]',4.7,198],
        ['Lal Mirch Powder','लाल मिर्च पाउडर','red-chilli-powder','spices',79,109,'100g',55,'','🌶️','#E74C3C','Made from sun-dried Byadgi and Kashmiri chillies. Brilliant red color with moderate heat.','["Byadgi Chilli","Kashmiri Chilli"]',4.6,167],
        ['Dhaniya Powder','धनिया पाउडर','coriander-powder','spices',59,79,'100g',80,'','🌿','#27AE60','Slow-roasted coriander seeds stone-ground for unmatched aroma and flavor.','["Coriander Seeds (Dhania)"]',4.5,134],
        ['Mathri','मठरी','mathri','snacks',119,159,'200g',40,'bestseller','🫓','#D4A017','The quintessential North Indian tea-time snack. Pure wheat flour, ghee, and carom seeds — hand-kneaded and slow-fried.','["Wheat Flour","Pure Ghee","Carom Seeds","Cumin Seeds","Salt","Black Pepper"]',4.7,221],
        ['Namak Para','नमक पारे','namak-para','snacks',99,139,'200g',38,'','🥨','#C8A882','Diamond-shaped, airy, crispy, and lightly salted. A festival staple made with pure ghee.','["Wheat Flour","Ghee","Salt","Carom Seeds","Black Pepper","Cumin"]',4.5,145],
        ['Besan Sev','बेसन सेव','besan-sev','snacks',109,149,'200g',50,'new','🟡','#FFA500','Thin, crunchy, golden sev made from fresh chickpea flour. A versatile snack for eating straight or topping chaat.','["Chickpea Flour (Besan)","Oil","Salt","Red Chilli","Turmeric","Carom Seeds"]',4.6,178],
        ['Chakli','चकली','chakli','snacks',129,179,'200g',25,'','🍩','#8D6E63','Star-shaped spiral snacks from the Maharashtrian tradition. Rice flour and spices deep-fried to hollow, crisp perfection.','["Rice Flour","Urad Dal Flour","Sesame Seeds","Cumin","Red Chilli","Salt","Oil"]',4.8,203],
        ['Ghee Ke Ladoo','घी के लड्डू','ghee-ladoo','sweets',199,259,'250g',30,'bestseller','✨','#FFD700','The king of Indian sweets. Pure desi cow ghee, freshly roasted besan, fine sugar, and fragrant cardamom. Hand-rolled with love.','["Besan","Pure Desi Ghee","Sugar","Green Cardamom","Cashews","Almonds","Raisins"]',4.9,287],
        ['Besan Ki Barfi','बेसन की बर्फी','besan-barfi','sweets',179,239,'250g',20,'','🟤','#8D6E63','Slow-cooked for 45 minutes until the besan is perfectly caramelized, then set in pure ghee. Topped with silver vark.','["Chickpea Flour","Pure Ghee","Sugar","Cardamom","Pistachio","Silver Vark"]',4.7,165],
        ['Khajur Roll','खजूर रोल','khajur-roll','sweets',219,299,'200g',18,'organic','🟤','#6D4C41','Zero refined sugar. Medjool dates, roasted nuts, seeds and cardamom. A sweet that is genuinely good for you.','["Medjool Dates","Almonds","Cashews","Walnut","Pumpkin Seeds","Cardamom","Desiccated Coconut"]',4.8,134],
        ['Atta Pinni','आटा पिन्नी','atta-pinni','sweets',189,249,'250g',27,'','🌾','#A1887F','A Punjabi winter super-food. Whole wheat flour slow-roasted in desi ghee, mixed with jaggery, gond, and warming spices.','["Whole Wheat Flour","Pure Ghee","Jaggery","Gond (Edible Gum)","Dry Ginger Powder","Cardamom","Dry Fruits"]',4.7,112]
      ];

      for (const p of products) {
        await client.query(
          `INSERT INTO products (name, name_hi, slug, category, price, mrp, weight, stock, badge, emoji, color, description, ingredients, rating, reviews)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
          p
        );
      }
      console.log('Products seeded (16 products)');

      const adminPwd = bcrypt.hashSync('admin123', 10);
      await client.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
        ['Admin', 'admin@maatikaswad.com', adminPwd, 'admin']
      );
      console.log('Admin user seeded (admin@maatikaswad.com / admin123)');
    }
  } finally {
    client.release();
  }
}

initDb().catch(err => {
  console.error('Database initialization failed:', err.message);
});

module.exports = pool;
