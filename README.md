# 🎬 Angular Star Wars Movies App  
### A Fully Scalable NgRx State Management Project

This is an Angular application that fetches **Star Wars movies and characters** from an API and manages all data using a **fully architecture-driven NgRx setup**.  
It demonstrates real-world NgRx patterns including:

- Feature-based store structure  
- Entity adapters (NgRx Entity)  
- Strongly typed selectors  
- Smart effects with side-effects and API calls  
- Facade design pattern  
- Loading state management  
- Missing data hydration (fetch only missing characters)  

This project is structured to match professional enterprise Angular applications.

---

## 🚀 Features

- Retrieve a list of Star Wars movies  
- View full details about a selected movie  
- Automatically load characters related to the movie  
- Fetch **only characters not already present in the store**  
- Display loading spinners until movie/character data is fully loaded  
- Full NgRx architecture with feature modules  
- Clean, reusable, and scalable facade layer  
- Entity-based state (fast lookups, efficient updates)

---

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| **Angular** | Frontend framework |
| **NgRx Store** | State container |
| **NgRx Effects** | API side-effects |
| **NgRx Entity** | Efficient normalized collections |
| **NgRx Selectors** | Performant state querying |
| **Facade Pattern** | Clean component store access |
| **Angular Material** | UI components (spinner, cards, etc.) |

---

## 🧱 Architecture Overview

This project follows a **feature-based folder structure**:

