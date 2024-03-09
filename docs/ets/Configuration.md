
# Configuration

Proper configuration of the ETS-Cli environment is crucial for efficient development and deployment of your modules. This section provides detailed information on configuring your development environment and preparing for deployment.

### Environment Settings Configuration

After initializing your ETS project, an `ets.env` file is created in your project directory. This file contains essential configuration settings for your development and deployment process. Key settings include:

!> Unless you are building a complex project, you should keep the defaults that are 
installed in the `ets.env` from init. 
- **ETS_MODULE_DIR**: Defines where individual modules are transpiled to. Default is 'modules'.
- **ETS_COMMON_DIR**: Indicates where common functions are transpiled when running `npx ets libs`. Default is 'common'.
- **ETS_MODULES_TS_DIR**: The root directory for TypeScript module creation. Default is 'modules'.

### Deployment Configuration

Deployment configuration settings are also specified in the `ets.env` file. These settings are critical for deploying your modules to a development or production server. Key deployment configurations include:

- **DEV_HOST**: The host address for SCP file connections. Localhost or IP addresses can be used for local or remote deployment, respectively.
- **DEV_PATH**: The server directory path where files are copied during deployment.
- **DEV_USER**: Username for SCP login.
- **DEV_PASS**: Password for SCP login.
- **DEV_PORT**: Port used for SCP server connection. Defaults to 22.
- **DEV_PRIVATE_KEY**: Path to a private key for SSH connections, if applicable.
- **DEV_PRIVATE_KEY_PASS**: Passphrase for the private key, if applicable.

Remember to replace `DEV_` with `PROD_` for production environment configurations.

## Set up remote deployment
To deploy your modules to an Azerothcore or Trinitycore server via SSH, setting up SSH key authentication is recommended. This method enhances security by eliminating the need to enter a password for each deployment.

### Generating an SSH Key Pair
1. Open a terminal on your local machine.
2. Generate a new SSH key pair with the command:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   Replace your_email@example.com with your email address. This email is just a label to help you identify the key.
3. Follow the on-screen instructions to specify a file to save the key and enter a passphrase for extra security, or for simplicity leave it blank. 

### Adding Your SSH Key to the Server
1. Copy your public SSH key. If you used the default save location, your public key can be found in ~/.ssh/id_rsa.pub. 
```bash
cat ~/.ssh/id_rsa.pub
```
2. Login to your remote WoW Server
3. Now, append your public SSH key to the authorized_keys file, you copied from your local machine earlier. You can do this by editing ~/.ssh/authorized_keys using a text editor or by running:
```bash 
echo (replace with your_public_key) >> ~/.ssh/authorized_keys
```

?> If you have not set up authorized keys on the server use the commands below when logged into to your remote server.

```bash
  mkdir -p ~/.ssh
  touch ~/.ssh/authorized_keys
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
```

## Default configuration:
```bash
# ETS Build Settings
# In order for the build to work correctly all build setting values must be set
# The program does not have defaults and builds will fail. 

# Root folder where built modules will be stored. 
ETS_BUILD_ROOT="./dist"

# directory where transpiled lua modules will be built for deployment 
ETS_MODULE_DIR="module"

# Build directory of where common tstl lualibraries if needed by modules 
ETS_COMMON_DIR="common"

# Root where all TS Modules are found from root of project
ETS_MODULES_TS_DIR="modules"

# deployment dev settings 
DEV_HOST=
DEV_PATH=
DEV_USER=
DEV_PASS=
#DEV_PORT=
#DEV_PRIVATE_KEY=
#DEV_PRIVATE_KEY_PASS=

# deploy prod settings
PROD_HOST=
PROD_PATH=
PROD_USER=
PROD_PASS=
#PROD_PORT=
#PROD_PRIVATE_KEY=
#PROD_PRIVATE_KEY_PASS=
```