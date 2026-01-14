# 🏯 Contributing to NekkoDojo

**Welcome, Ninja.**

Thank you for your interest in contributing to **NekkoDojo**! Whether you are a White Belt fixing a typo or a Sensei re-architecting the backend, your contributions help sharpen the skills of disciples everywhere.

Please take a moment to review this document to ensure the process is smooth and effective for everyone.

---

## 🐛 Reporting Bugs & Requesting Features

Before you write any code, please check our [Issue Tracker](https://github.com/yourusername/nekko-dojo/issues) to ensure the issue hasn't already been reported.

### 🐞 Found a Bug?
If you spot a flaw in our technique:
1.  **Check existing issues** to see if it is already known.
2.  Open a **New Issue** with the label `bug`.
3.  Include:
    * **Steps to reproduce** (Be specific!).
    * **Expected behavior** vs. **Actual behavior**.
    * Screenshots or error logs if applicable.

### 💡 Have a Feature Idea?
If you want to propose a new training style:
1.  Open a **New Issue** with the label `enhancement` or `feature`.
2.  Explain **why** this feature is valuable to the Dojo.
3.  Describe how you imagine it working (UI mocks are bonus points!).

---

## 💻 Development Setup

To start training locally, follow these steps:

1.  **Fork and Clone**
    Fork the repository to your GitHub account, then clone it:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/nekko-dojo.git](https://github.com/YOUR_USERNAME/nekko-dojo.git)
    cd nekko-dojo
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Copy the example environment file (if available) or create a `.env` file:
    ```bash
    cp .env.example .env
    ```
    *Ensure you have valid API keys for **Clerk** and a connection string for **PostgreSQL**.*

4.  **Database Setup**
    Apply the Prisma schema to your local database:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the Dojo**
    ```bash
    npm run dev
    ```
    The app should be running at `http://localhost:3000`.

---

## 🥷 Code Style & Dojo Rules

To keep our codebase clean and disciplined, please adhere to these standards:

### 1. TypeScript
* **No `any` types.** We strive for strict typing. Define interfaces or types for your props and data.
* Use **Functional Components** for React.

### 2. Styling
* We use **Tailwind CSS**. Avoid standard CSS files unless absolutely necessary.
* Use **Shadcn UI** components (`components/ui`) whenever possible to maintain visual consistency.
* **Responsive Design:** Ensure your UI looks good on Mobile (`sm`), Tablet (`md`), and Desktop (`lg`).

### 3. Formatting
* We use **Prettier** and **ESLint**.
* Run the linter before pushing:
    ```bash
    npm run lint
    ```

---

## 🌿 Branching & Commit Guidelines

### Branching Strategy
Create a new branch for every task. Do not push directly to `main`.
* **Format:** `type/short-description`
* **Examples:**
    * `feat/add-user-heatmap`
    * `fix/navbar-mobile-layout`
    * `docs/update-readme`

### Commit Messages
We follow the **Conventional Commits** specification. This helps generate changelogs automatically.

* `feat:` A new feature
* `fix:` A bug fix
* `docs:` Documentation only changes
* `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc)
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `chore:` Maintenance tasks

**Example:**
```text
feat: add dynamic reputation calculation to user profile
```

---

## 📬 Submitting a Pull Request

When your training is complete and you are ready to submit your code:

1.  **Push your branch** to your forked repository.
2.  Open a **Pull Request (PR)** against the `main` branch of the original repo.
3.  **Fill out the PR Template**:
    * Link the Issue you are solving (e.g., `Closes #42`).
    * Provide a summary of changes.
    * Attach **Screenshots** or **Videos** if you changed the UI (this helps reviewers immensely!).
4.  Wait for a code review from a Sensei (Maintainer). Be open to feedback!

---

## 📜 Code of Conduct

We are a community of learners and masters. Respect is our core tenet.

By participating in this project, you agree to abide by our **[Code of Conduct](CODE_OF_CONDUCT.md)**.
* Be respectful and inclusive.
* Accept constructive criticism gracefully.
* Focus on what is best for the community.

---

<<<<<<< HEAD
**Thank you for contributing to NekkoDojo!** 🥋
=======
**Thank you for contributing to NekkoDojo!** 🥋
>>>>>>> 3da02c100f4e0625424b3a07c85bdaada6261d46
