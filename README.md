# 🏯 NekkoDojo

> **Train your code. Earn your belt. Become a master.**

NekkoDojo is a gamified coding platform designed to make algorithm practice engaging and community-driven. Users (Disciples) solve coding problems to earn reputation, unlock new martial arts belts, and climb the ranks from White Belt to Black Belt.

![NekkoDojo Banner](https://via.placeholder.com/1200x400?text=NekkoDojo+Preview+Image)
*(Replace this link with a screenshot of your actual dashboard later)*

## 🎯 Motivation
Learning data structures and algorithms can be dry and isolating. **NekkoDojo** aims to fix this by wrapping the "grind" in a fun, martial-arts-themed progression system. We focus not just on solving problems, but on **community interaction**, rewarding users for helping others through discussions and quality comments.

## ✨ Key Features
* **🥋 Belt Progression System:** Automatically rank up from *White Belt* to *Black Belt* based on the number of problems solved.
* **📊 Activity Heatmap:** GitHub-style activity tracking to visualize your daily training consistency.
* **💬 Community Discussions:** Rich text discussions with a reputation system that rewards high-quality contributions.
* **🛡️ Role-Based Access Control:**
    * **Senseis (Admins):** Full system control and user management.
    * **Guardians (Moderators):** Content moderation capabilities.
    * **Disciples (Users):** Standard access to solve and discuss.
* **📈 Analytics Dashboard:** Detailed breakdowns of solved problems by category, company, and difficulty.

## 🛠️ Tech Stack
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** [Clerk](https://clerk.com/)
* **Styling:** Tailwind CSS & Shadcn UI
* **Charts:** Recharts
* **Icons:** Lucide React

---

## 🚀 Getting Started

Follow these instructions to set up the Dojo locally.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* A PostgreSQL database (local or hosted like Neon/Supabase)
* A Clerk account for authentication

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/nekko-dojo.git](https://github.com/yourusername/nekko-dojo.git)
    cd nekko-dojo
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    # Database
    DATABASE_URL="postgresql://user:password@localhost:5432/nekkodojo"

    # Clerk Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...

    # URLs
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Setup Database (Prisma)**
    ```bash
    # Generate Prisma Client
    npx prisma generate

    # Push schema to DB
    npx prisma db push
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to enter the Dojo.

---

## 📂 Project Structure

```bash
nekko-dojo/
├── app/
│   ├── (auth)/          # Sign-in/Sign-up pages (Clerk)
│   ├── (root)/          # Main application layout
│   │   ├── profile/     # User profile & stats logic
│   │   ├── problems/    # Coding questions list
│   │   └── discussions/ # Community forum
│   ├── api/             # Backend API routes (webhooks, data fetching)
│   └── layout.tsx       # Root layout
├── components/
│   ├── User/            # Profile components (Heatmap, Belts, Details)
│   ├── Admin/           # Admin dashboard cards & tables
│   └── ui/              # Shadcn UI reusable components
├── lib/
│   ├── prisma.ts        # DB client instance
│   └── utils.ts         # Helper functions
├── prisma/
│   └── schema.prisma    # Database schema definition
└── public/              # Static assets

## 🤝 How to Contribute

We welcome all ninjas who wish to improve the Dojo!
Please read our `CONTRIBUTING.md` (if available) for details on our code of conduct and the process for submitting pull requests.

1.  **Fork the repo** on GitHub.
2.  **Create your feature branch** (`git checkout -b feature/amazing-feature`).
3.  **Commit your changes** (`git commit -m 'Add some amazing feature'`).
4.  **Push to the branch** (`git push origin feature/amazing-feature`).
5.  **Open a Pull Request**.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

*System Online. Dojo is Open.* ⛩️