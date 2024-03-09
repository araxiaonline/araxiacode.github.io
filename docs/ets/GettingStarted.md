# Getting Started

### Overview
ETS-Cli simplifies the development process, enabling you to leverage TypeScript and TypeScriptToLua to enhance or create new server content without needing extensive Lua knowledge. Whether you're looking to introduce new gameplay features, automate server tasks, or customize player interactions, ETS-Cli provides the foundation you need to bring your ideas to life.

Getting started with the Eluna TypeScript Module (ETS-Cli) is your first step toward creating custom scripts for WoW servers with Eluna installed. This section covers the prerequisites, installation process, and initial setup to get your development environment ready.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- NodeJS (version 18 or higher). NodeJS is essential for running the ETS-Cli tool and its dependencies. 

>Note Download and install NodeJS from the [official website](https://nodejs.org/en/download/).

### Installation

Once you've installed NodeJS, setting up ETS-Cli is straightforward. Follow these steps to create your first ETS project:

1. **Create Your Project Directory**:
   ```bash
   mkdir my-ets-project
   cd my-ets-project
   ```
2. **Initialize a New NodeJS Project**:
Initialize your project with npm. This will create a package.json file in your project directory.
   ```bash
   npm init -y
   ```
3. **Install ETS-Cli**:
Install the ETS-Cli package using npm. This command adds ETS-Cli to your project's dependencies.

   ```bash
   npm install wow-eluna-ts-module
   ```
4. **Initialize Your ETS Project**:
Use the ETS-Cli tool to initialize your project. This step sets up the necessary configuration files and directory structure.
   ```bash
   npx ets init
   ```

After completing these steps, your development environment is set up, and you're ready to start creating your first module.

With your environment set up, you're now ready to dive into module development. Proceed to the Creating Modules section to learn how to create, build, and deploy your custom scripts.