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
