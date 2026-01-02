# Santa's list 🎁

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

An interactive web application designed to create the perfect wishlist and help Santa Claus manage it without losing the magic.

## ✨ Key Features

The application is designed with a "dual-user" flow to keep the gifts a secret.

### Two Usage Modes

1.  **🧒 Kid Mode (My Wishlist)**
    * *Default View.*
    * Designed for children to fill out their letter to Santa.
    * Allows adding gifts, store links, and notes.
    * **No Spoilers:** Cannot see hidden ("Surprise") gifts nor the purchase status.

2.  **🎅 Santa Mode (Management & Surprises)**
    * *Admin View.*
    * Allows **list management**: Mark gifts as "Bought" (check) and edit details.
    * **Additional Gifts:** Allows adding extra gifts marked as **"Surprise"**. These gifts are invisible in Kid Mode.
    * Visualization of bought vs. pending gift statistics.

### 🛠️ Utilities
* **Persistence:** Data is saved in `LocalStorage`, ensuring it isn't lost upon reload.
* **Priorities:** Classification system (Low 🎁, Medium ⭐, High 🌟).
* **Countdown:** Real-time countdown to Christmas.

---

## 📸 Screenshots

### Kid Mode (Create List) 📝
![Kid Mode](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1767363973/Captura_de_pantalla_2026-01-02_152416_ojsb0i.png)

---

### Santa Mode (Manage) 🎅
![Santa Mode](https://res.cloudinary.com/dc4u0bzgh/image/upload/v1767363973/Captura_de_pantalla_2026-01-02_152528_wquqxz.png)

## 🛠️ Code Structure

The project follows a modular and didactic architecture:

```text
📁 proyecto-navidad/
├── 📁 favicon/        # Web icons
├── 📄 index.html      # HTML Structure
├── 🎨 style.css       # Styles and themes
├── 🧠 app.js          # Interface logic and events
├── 💾 storage.js      # Local database (LocalStorage)
└── 📄 README.md       # Documentation

```
## 🔮 Next Steps

Currently, the application runs in the user's browser (`LocalStorage`). The long-term goal is to convert it into a real collaborative application:

| Feature | Description & Goal |
| :--- | :--- |
| **☁️ Backend & Database** | Migrate to a cloud solution (like **Firebase** or **Supabase**) or create a custom API. This allows data to be saved online rather than just on the current device. |
| **🔗 "Share" System** | Generate a unique link to easily share the list with family members (Santa) via WhatsApp or Email. |
| **⚡ Real-Time Sync** | Ensure that when the "Kid" adds a gift, it appears instantly on "Santa's" screen without needing to reload. |
| **👥 Multi-User** | Implement a secure Login system so each family member can have their own private lists. |
---
Lovingly crafted by Julia 💞
