# 🚗 GearPro – Car Specification Explorer

**GearPro** is a sleek, frontend-only web application that allows users to explore detailed specifications of thousands of car trims based on Make, Model, and Year. It's ideal for car enthusiasts, buyers, and researchers looking for a detailed, user-friendly car database.

---

## 🔍 Features

- ✅ **Filter by Make, Model & Year**  
- 🚙 **Explore All Available Trims** for selected cars  
- 📊 **Detailed Specs** including engine type, torque, body size, fuel efficiency, and much more  
- 🌐 **Live Wikipedia Summary** for each car  
- 🖼️ **Trim-Specific Images** using Unsplash API  
- 📁 Fully client-side – **No Backend Required**

---

## 💡 Tech Stack

| Technology     | Usage                            |
|----------------|----------------------------------|
| **HTML/CSS**   | UI structure and styling         |
| **JavaScript** | Dynamic filtering & rendering    |
| **JSON**       | Car data storage & matching      |
| **Wikipedia API** | Description and image preview |
| **Unsplash API**  | Trim-specific image fetching   |

---

## 📁 Folder Structure
<p>
GearPro/ <br>
│ <br>
├── index.html # Main UI <br>
├── car_api.js # Logic and API integration <br>
├── /data <br>
│    ├── car_data.json # Make & Model options <br>
│    └── car_specs.json* # Detailed specifications (Large file) <br>
├── README.md # You’re here! <br>
</p>

> ⚠️ `car_specs.json` is a large file. You may need to set up [Git LFS](https://git-lfs.github.com/) if contributing.

---

## 📷 API Integration

- 🔗 [Wikipedia Summary API](https://en.wikipedia.org/api/rest_v1/)  
- 🔗 [Unsplash Photo API](https://unsplash.com/developers)

---

## 💻 Setup & Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/HassanNawaz14/GearPro.git
   cd GearPro

2. If using large files like car_specs.json:
    ```bash
    git lfs install
    git lfs pull

3. Open index.html in your browser:
    ```bash
    start index.html

## 👨‍💻 Author
<strong>Hassan Nawaz </strong> <br>
📍 Data Science Student – FAST NUCES Lahore <br>
🔗 GitHub : https://github.com/HassanNawaz14 <br>
✉️ hafizhassan142003@example.com

## 📜 License
 License – feel free to use and modify for personal or educational purposes.

