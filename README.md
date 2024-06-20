# Deploying a Node JS Application on EC2 Step by Step

### Step 1: Navigate to EC2 Dashboard
In the AWS Management Console, type "EC2" in the search bar and select "EC2" from the dropdown menu.  
This will take you to EC2 Dashboard

![step1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step1.png?raw=true)

### Step 2: Click on launch instance
  
![step2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step2.png?raw=true)

### Step 3: Configure the Instance

#### 3.1 Select Name
![step3.1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step3.png?raw=true)

#### 3.2 Choose Amazon Machine Image 
For our purpose, we can use the Ubuntu Server  

![step3.2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step4.png?raw=true)

#### 3.3 Choose an Instance type
Select the "t2.micro" instance type.  

This instance type is part of the free tier for eligible users, offering 750 hours per month for the first 12 months.  

![step3.3](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step5.png?raw=true)

#### 3.4 Select a Key Pair
You need a key pair to SSH into your instance.  

If you already have a key pair, select it. If not, create a new key pair and download it (.pem file). Keep this file secure as you’ll need it to access your instance.

![step3.4.1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step6.png?raw=true)

![step3.4.2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step7.png?raw=true)

#### 3.5 Configure Security Group
A security group acts as a virtual firewall to control inbound and outbound traffic.
Create a new security group with following rules.

![step3.5](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step8.png?raw=true)

#### 3.6 Launch Instance
Click on launch instance

![step3.6](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step9.png?raw=true)


### Step 4: Connect to EC2 instance using EC2 Instance Connect

![step4.1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step10.png?raw=true)

![step4.2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step11.png?raw=true)

This should connect you to the virtual machine.

You can also connect to the instance using the ssh key we generated earlier (Optional)

![step4.3](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step12.png?raw=true)

### Step 5: Update package list and install dependencies

#### 1. Setup the EC2 instance

```bash
sudo apt update
sudo apt upgrade
```

#### 2. Install NodeJS and npm
Add the Node.js PPA (Personal Package Archive) to get the latest version of Node.js:

```bash 
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
```

Then install Node.js and npm:
```
sudo apt install nodejs -y
```

---

Verify Installation of Node.js and npm

Check Node.js version
```bash
node -v
```
Check npm version
```bash
npm -v
```

If npm is not installed for some reason, you can install it separately.
```
sudo apt install npm -y
```

---

#### 3. Install Git
You need to install git to bring your files into virtual machine.
If you are going to `scp` (Secure copy protocol) for transferring your files, you can skip this step

```bash
sudo apt install git -y
```

### Step 6: Transfer the project files
In this step, you need to transfer all the project files using either git or scp or any other mechanism

For this example, I'll use git

Navigate to the directory where you want to clone your project. For example, your home directory:

```bash
cd ~
```

Clone your repository

```bash
git clone https://github.com/your-username/your-repo-name.git
```
Replace your-username and your-repo-name with your GitHub username and repository name respectively.

![step6.1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step13.png?raw=true)

![step6.2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step14.png?raw=true)


### Step 7: Install project dependencies

#### 1. Navigate to your Project Directory
```bash
cd your-repo-name
```

#### 2. Install Project Dependencies
Use npm to install the project dependencies defined in your package.json file:

```bash
npm install
```

![step7](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step15.png?raw=true)

You cannot directly run your application due to the following reasons:
1. We need to set up the environment variables
2. We need the application to run in the background. If we close the terminal, the server will shut down
3. Our application is running on port 3000. The Firewall does not accept connections to that port as we haven't enabled it in our security group settings

### Step 8: Setup environment variables

#### 1.  Create the Environment File
```bash
sudo vim /etc/app.env
```

#### 2. Add your variables
In Vim, add your variables in the format VARIABLE=value. For example:
```
PORT=3000
```

> Press `i` to enter insert mode in vim
> Paste the environment variables
> Press Escape to exit the mode
> Enter: `:x` to save and exit

![step8](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step16.png?raw=true)

#### 3. Restrict the file permissions for security.
```bash
sudo chmod 600 /etc/app.env
sudo chown ubuntu:ubuntu /etc/app.env
```

### Step 9: Run the server in background

We want our node.js server to run in the background, i.e.: when we close our terminal we want our server to keep running

For this purpose, we need a `Daemon Service`
A daemon is a background process or program that is designed to perform tasks without any direct user intervention

We can create a daemon service using `systemd`.

Nearly every Linux distro comes with systemd, which means forever, monit, PM2, etc are no longer necessary - your OS already handles these tasks.

Creating a `daemon service` with `systemd` involves writing a `script` for the daemon process and creating a service file for systemd to manage it.

A systemd service file is a unit configuration file that defines how systemd starts and manages a certain background service.

#### 1. Create the systemd Service File
Navigate to the systemd directory and create a new service file, `myapp.service`.

```bash
sudo vim /etc/systemd/system/myapp.service
```

#### 2. Define the service settings
Add the following content in Vim, modifying as needed for your application.


```bash
[Unit]
Description=Node.js App
After=network.target multi-user.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/app
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=/etc/app.env
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
```
  

Change the `Description` as per your app name.  
Change the `WorkingDirectory` to `/home/ubuntu/your-repo-name`

There are different ways to start a Node.js application, depending on your project setup.
Change the `ExecStart` to `/usr/bin/project_start_command`
For example: `npm start` or `node server.js` or `nodemon server.js`

Change the `SyslogIdentifier` to project name for logging purposes



![step9.1](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step17.png?raw=true)

  
#### 3. Reload systemd and start your service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable myapp.service
sudo systemctl start myapp.service
```

Verify that the service is running properly.

```bash
sudo systemctl status myapp.service
```

![step9.2](https://github.com/tirthraj07/deploy-nodejs-on-ec2/blob/main/public/step18.png?raw=true)

---