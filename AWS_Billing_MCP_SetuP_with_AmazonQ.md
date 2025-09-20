### **MCP – Model Context Protocol \+ Amazon Q: My Journey to AWS Cost Control**

From way back, I’ve been looking for a solution that lists all my current resources across all regions, showing what the current cost is, and which service is eating up more money. Finally, I found a solution thanks to Amazon Q with AWS Billing MCP\!

I just did the AWS Billing MCP setup for my AWS Free Tier account to cut down on unwanted costs. Let me tell you about it.

#### **Billing MCP Introduction**

What is MCP?  
MCP, or Model Context Protocol, is basically a way for Amazon Q to securely connect with your local environment. It lets Q run commands on your behalf to get real-time info. For AWS Billing, it means Amazon Q can tap into your AWS billing and resource data to give you cost insights.  
How it works?  
Amazon Q, as an AI, doesn’t directly access your AWS account. Instead, the MCP server acts like a middleman. When you ask Q about your AWS costs, Q sends the request to the local MCP server running on your machine. This server then uses your AWS CLI setup to run the necessary commands and grab the data, showing it back to you. The best part? It always asks for your approval before running any command, so you’re always in charge\!

#### **How to Set Up: My Step-by-Step Guide**

---

#### **Section I: Configure Amazon Q CLI**

1. **Launch an instance with Ubuntu.**  
2. **Update system packages:**  
   Bash  
   sudo apt update \-y

3. **Download Amazon Q CLI package:**  
   Bash  
   wget https://desktop-release.q.us-east-1.amazonaws.com/latest/amazon-q.deb

4. **Install Amazon Q CLI package:**  
   Bash  
   sudo dpkg \-i amazon-q.deb

5. **Install dependencies:**  
   Bash  
   sudo apt install \-f \-y

6. **Verify the Amazon Q installation:**  
   Bash  
   q \--version
   <img width="1324" height="323" alt="003" src="https://github.com/user-attachments/assets/6f4c5142-062c-4af9-a9fe-3beb03084286" />

8. Amazon Q Login with your Builder ID:  
   If you already have a Builder ID, great\! If not, create one. It’s different from your AWS user ID and takes about 5 minutes from this URL:  
   https://us-east-1.signin.aws/platform/login?workflowStateHandle=738d74a3-3406-4c13-bb36-a7daa36af48c  
   Then, log in to Amazon Q:  
   Bash  
   q login

   Select "User for free with Builder ID." It will pop up a URL. You need to copy this URL, paste it into your browser, and then log in with your Builder ID credentials that you just created or already have.  
   Once you give your credentials, you’ll receive a verification code on your email. Enter that verification code, confirm, and allow access.  
   Now, return to our EC2 instance. You will see "device authorized and logged in successfully."  

   <img width="1325" height="192" alt="002" src="https://github.com/user-attachments/assets/be44aee2-3952-448e-8442-67fc0a40e394" />

9. **Press q to launch Amazon Q CLI:**  
   Bash  
   q
   <img width="1325" height="590" alt="004" src="https://github.com/user-attachments/assets/e524b3d2-09b9-41e9-8fb2-b529801e6452" />

11. **Now, quit from Q CLI** so we can move forward with the rest of the process:  
   Bash  
   /quit
   <img width="1327" height="192" alt="005" src="https://github.com/user-attachments/assets/88d0f12e-90cf-461e-85e3-8fb34af2f313" />

---

#### **Section II: Set Up AWS CLI**

1. **Check Snap version:**  
   Bash  
   snap version

   If Snap isn't enabled, just run these commands to get it going:  
   Bash  
   sudo apt update  
   sudo apt install \-y snapd  
   sudo systemctl enable \--now snapd.socket

   Then, check the Snap version again:  
   Bash  
   snap version
   <img width="1325" height="154" alt="011" src="https://github.com/user-attachments/assets/d38d1b04-a604-4229-beb8-efa13cf4749a" />

3. **Now, install AWS CLI** using the command below:  
   Bash  
   sudo snap install aws-cli \--classic

4. **Verify the AWS CLI:**  
   Bash  
   aws \--version

5. **Create an IAM user with Administrative privileges.** Then, create an Access Key for the user.  
   Go to IAM \> Users \> Create User.  
   * Select: "Provide user access to the AWS Management Console."  
   * Select: "I want to create an IAM user."  
   * Select: "Custom password."  
   * Uncheck: "Users must create a new password at next sign-in."  
     \> Next \> Select: "Attach policy directly" \> Select "Administrative Access" policy \> Next \> Create User.

   \> Click "View User" \> Click: "Create Access Key."

   * Select "Use case" as: "Command Line Interface (CLI)."  
   * Check the confirmation.  
   * Next.  
   * Give a tag to your access key (any name).  
   * Create Access Key.  
     \> Copy the Access Key & Secret Access Key into a notepad and move to your EC2 instance, where we need to configure AWS CLI.  
6. **Configure the AWS CLI login credentials:**  
   Bash  
   aws configure

   It will ask for your Access Key, Secret Access Key, and Region:  
   Bash  
   ubuntu@ip-172-31-28-248:\~$ aws configure  
   AWS Access Key ID \[None\]: YOUR\_ACCESS\_KEY\_HERE  
   AWS Secret Access Key \[None\]: YOUR\_SECRET\_ACCESS\_KEY\_HERE  
   Default region name \[None\]: us-east-1  
   Default output format \[None\]: json

   ubuntu@ip-172-31-28-248:\~$ aws \--version  
   aws-cli/2.30.6 Python/3.13.7 Linux/6.14.0-1011-aws exe/x86\_64.ubuntu.24  
   ubuntu@ip-172-31-28-248:\~$
   <img width="1331" height="151" alt="012" src="https://github.com/user-attachments/assets/9924f07a-674b-4b22-8991-9e354a7de7ad" />

---

#### **Section III: Configure Python for MCP Server Setup**

This section will cover how to set up an MCP server that lets Amazon Q access AWS pricing.

1. **Update the package list:**  
   Bash  
   sudo apt update \-y

2. By default, Ubuntu repositories don't contain the Python package. For that, we need to do the following:  
   Install software-properties-common package using the command below:  
   Bash  
   sudo apt install \-y software-properties-common

   *Why?* This package gives you the add-apt-repository command, which helps you easily add new PPAs (Personal Package Archives) or third-party repositories to your system. Without it, add-apt-repository wouldn’t be there on many Ubuntu/Debian-based systems.  
3. **Add a new repository to your system** using the commands below:  
   Bash  
   sudo add-apt-repository ppa:deadsnakes/ppa \-y

   *What's happening?* This adds the Deadsnakes PPA to your system's list of repositories. deadsnakes/ppa is a well-known PPA that    provides newer versions of Python than what’s officially in Ubuntu’s default repositories. Ubuntu’s default repositories often have older Python versions (sometimes outdated). The Deadsnakes PPA is maintained by trusted Ubuntu community developers and includes the latest & multiple Python versions (e.g., Python 3.8, 3.9, 3.10, 3.11, etc.), so you can install whichever version you need.  
   <img width="1332" height="518" alt="006" src="https://github.com/user-attachments/assets/d8c1bc7d-46c4-46be-bfac-bdc6831642e4" />

4. **Now, install Python 3.10:**  
   Bash  
   sudo apt install python3.10 \-y

5. **Verify the version:**  
   Bash  
   python3.10 \--version

6. **Install the Python virtual environment module.** This lets us create Python virtual environments, which means each project can have its own isolated Python packages.  
   Bash  
   sudo apt install python3.10-venv \-y

   *Heads up:* Be patient here; it might take some time. If you feel your instance hung, refresh the window and rerun the same command once again.  
7. **Install development headers:**  
   Bash  
   sudo apt install python3.10-dev \-y

   *Purpose:* This installs the development files and C headers for Python 3.10. It provides the headers and development tools needed to build Python packages with native extensions.  
   Now, we’re all ready with Python and all the required packages\!  
8. **Create a Python virtual environment** to isolate the MCP server:  
   Bash  
   python3.10 \-m venv \~/aws-mcp-env

9. **Activate the Virtual environment** – this lets you enter into the virtual environment:  
   Bash  
   source \~/aws-mcp-env/bin/activate
   <img width="1318" height="138" alt="007" src="https://github.com/user-attachments/assets/84a1bf09-8d99-4c2c-a2ae-28f3fd10a23e" />

---

#### **Section IV: Set Up MCP Server for AWS Billing MCP**

1. **Install the pip command:**  
   Bash  
   sudo apt install python3-pip \-y

2. **Install these packages:**  
   Bash  
   pip install \--upgrade pip

   *This updates pip (the Python package manager) to the latest version from PyPI.*  
   Bash  
   pip install uv uvenv trio

   *This installs three Python packages from PyPI:*  
   * uv: A super-fast Python package installer (think pip, but written in Rust).  
   * uvenv: A package that helps manage Python virtual environments more easily.  
   * trio: A Python async concurrency library (an alternative to asyncio). It helps you write structured, readable concurrent code, often used in networking, async servers, or advanced Python projects.

*Note:* If your session hangs at any point, refresh it using F5. It will take you back to the normal command prompt. You’ll need to activate your virtual environment again and then try installing the packages, and it should work.

3. **Configure Amazon Q to use the MCP server:**  
   Create a new directory:  
   Bash  
   mkdir \-p \~/.aws/amazonq

   Then, create the config file at \~/.aws/amazonq/mcp.json:  
   Bash  
   vi \~/.aws/amazonq/mcp.json

   And paste the code below, then save the file:  
   JSON  
   {  
     "mcpServers": {  
       "awslabs.billing-cost-management-mcp-server": {  
         "command": "uvx",  
         "args": \[  
           "awslabs.billing-cost-management-mcp-server@latest"  
         \],  
         "env": {  
           "AWS\_PROFILE": "default",  
           "AWS\_REGION": "us-east-1"  
         },  
         "disabled": false  
       }  
     }  
   }

   Save the file: :wq\!  
4. **Verify the file content:**  
   Bash  
   cat \~/.aws/amazonq/mcp.json

5. Once you've done everything, we’re good to use the MCP server\! If you face any issues setting up the configuration file or anything else, please refer to the AWS documentation.  
6. **Log in to Amazon Q again:**  
   Bash  
   q

7. **Now, you will see a screen similar to this.** If you do, it means you successfully installed the AWS Billing MCP server and connected it with the AWS Q CLI. First, it will initialize the MCP server and show a message like this:  
   <img width="1323" height="401" alt="009" src="https://github.com/user-attachments/assets/8121e316-4a3e-4eec-b649-2abc6c722f9e" />
   <img width="1325" height="594" alt="010" src="https://github.com/user-attachments/assets/fbbe1d5d-61f9-44c7-89b9-9f6d46c09e45" />

8. Alternatively, you can set up the entire thing with this single command *after* you set up Amazon Q. It will set up the billing MCP server by itself; you just need to approve whenever it prompts:  
   Bash  
   Set up a local MCP server for AWS Pricing MCP

9. Now our setup is ready, and Amazon Q CLI is here to assist you\! :)  
   We will test our billing MCP with some example questions.  
   Bash  
   q "Show me my current AWS billing setup"

   Then it will ask for your approval (y/n/t):  
   * y \- yes  
   * n \- no  
   * t \- always trust

   It will run the AWS CLI commands on behalf of us and show the result.It provides:

   * Account information  
   * Billing configuration  
   * Key observations  
   * Recommendations
   <img width="1330" height="591" alt="013" src="https://github.com/user-attachments/assets/b87dbf8e-5bb8-498b-94bf-65189fa0a168" />

How beautiful is this?\!Bash  
q "list all the currently running services in all the regions"  
Then it will write a shell script by itself to pull all the details and show them like this:*(Imagine the output here, just like you described it\!)*This is exactly what I wanted\! :)
   <img width="1319" height="557" alt="014" src="https://github.com/user-attachments/assets/f2c2c005-89ea-4058-bca9-991293c85c3c" />
   <img width="1336" height="248" alt="015" src="https://github.com/user-attachments/assets/72440e77-0e1d-4b59-85d2-21d244899d6a" />

**Example Queries for Our Day-to-Day Work:**

* q "Give me the total AWS spending for this month"  
   <img width="1325" height="591" alt="016" src="https://github.com/user-attachments/assets/dfd8d445-38a2-4fc5-a68a-2ab177fd513e" />

* q "Provide a monthly breakdown of spend for the past year in INR" 
   <img width="1325" height="556" alt="017" src="https://github.com/user-attachments/assets/9c4784dc-3b24-422a-a098-78a5c386f0b6" />
   <img width="1326" height="458" alt="018" src="https://github.com/user-attachments/assets/9e8f7df1-ff64-4fc7-850a-882a936c9356" />

* q "Highlight any unusual costs incurred over the last 90 days"  
* q "Am I staying within my monthly budget?"  
* q "Identify EC2 instances that are underused and could be downsized"  
* q "List all my AWS accounts along with their current expenses"  
* q "Estimate the cost effect of launching 5 new m5.large instances"  
* q "Notify me of any cost anomalies compared to historical trends"  
* q "Show costs grouped by team or project tags"  
* q "Predict AWS costs for the next quarter based on current usage"  
* q "Display resources that violate cost governance policies"  
* q "What is my top cost-saving opportunity right now?"  
* q "List all cost anomalies detected this week"  
* q "Which AWS accounts require urgent attention?"

**Essential Daily Prompts:**

* q "Check overall cost status" \# Health summary  
* q "Any cost alerts today?" \# Daily issues to review  
* q "Top potential savings opportunities" \# Quick wins  
* q "Remaining budget for this month" \# Daily planning

**Investigation Prompts:**

* q "What caused costs to spike yesterday?" \# Root cause analysis  
* q "Compare this month's spend with last month's" \# Trend review  
* q "Show all unused resources" \# Identify waste  
* q "Provide rightsizing recommendations" \# Optimization advice

**Planning Prompts:**

* q "Assess cost impact of a new deployment" \# Pre-deployment review  
* q "Forecast next month’s AWS bill" \# Budget planning  
* q "Evaluate ROI of Reserved Instances" \# Investment decisions  
* q "Project costs for the next quarter" \# Long-term planning

The best part is, it will take your approval before running any command\!

10. To exit from the Amazon Q 
    /quit
11. To exit from the Python Virtual Environemnt
    deactivate
12. Terminate the instance

---
