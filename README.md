# **Flow-captcha - Developer Guide**

This custom component for Boomi Flow facilitates the inclusion of a CAPTCHA feature within flow forms, empowering users with enhanced security measures during form interactions.

An exceptional capability within Boomi Flow is its custom component feature, offering developers the freedom to craft personalized UI components. This feature allows integrating custom-coded elements seamlessly into Flows primarily constructed using intuitive drag-and-drop low-code techniques.

This documentation would help you to understand how to build a custom react-captcha component and shows the steps to integrate with Boomi flow.


## What is a custom component in Boomi flow?

Boomi Flow is constructed using React.js and TypeScript as its foundational technologies, which can be explored further at[ https://react.dev/](https://react.dev/) and[ https://www.typescriptlang.org/](https://www.typescriptlang.org/). This framework enables the creation and integration of a wide array of React components within Boomi Flow, termed as custom components. These components can be tailored to suit various requirements, enhancing the flexibility and functionality of Boomi Flow.


## Legacy and new Boomi Flow player components

Boomi flow has two different players, we call them default-legacy and default. The default player is lightweight and more clean when compared to the default-legacy player, however, the default player at the moment is missing most of the important features for the legacy player. 

This custom component would support both default and legacy players, when we are talking about code deep dive i will explain.


## How to build a flow custom component?

This subject is highly valuable for discussion, with limited information available online. Most resources are outdated, lacking clear steps for self-initiated learning. In this documentation, I aim to provide a comprehensive, step-by-step guide on crafting a Boomi Flow custom component using React.js. The goal is to offer clarity and facilitate a smooth start to this process.


### Prerequisites.



1. Install vs code in your local computer.[https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Install node.js. I am running on Node.JS v16.20.2 for later versions this should still work. [https://nodejs.org/en](https://nodejs.org/en)
3. Clone the repo - [https://github.com/rswijesena/flow-captcha.git](https://github.com/rswijesena/flow-captcha.git) you can use, VS-Code terminal feature and make sure you have installed github plugging in your VS-Code
4. Hit the npm install command in the vs code terminal from your root folder of the clone. 


## Technical Deep Dive….

From this point onwards, I would discuss some of the concepts that are required when building custom components for Boomi flow, First the folder/files structure of the clone project.


#### Package.json

The package.json file contains essential details about a project, serving as both human-readable metadata (such as the project's name and description) and functional metadata that includes the package version number and a catalog of dependencies necessary for the application. To learn more about package.json i recommend this - [https://www.youtube.com/watch?v=YS3FDBjZCNc](https://www.youtube.com/watch?v=YS3FDBjZCNc)

I will explain more details about this file content when we reach the build and run section later.


#### CaptchaNew.tsx

As I mentioned earlier, Boomi flow has a new default player, this is the code that would support the new default player. The major difference is this code is using FCMNew react library built by Mark Watts.


#### CaptchaLegacy.tsx

This file contains the source code for the default-legacy player version.


#### CaptchaModel.tsx

This file contains all the business logic of our component. Infact, I have used the open source captcha library (`react-simple-captcha`) to build a Boomi flow custom component. Thanks to the creator of this component in react. More details - [https://www.npmjs.com/package/react-simple-captcha](https://www.npmjs.com/package/react-simple-captcha)

Let's see some of the code inside this file…


##### render() {} function

This is the main entry point to the business logic class and this function generates the HTML for the end user.


##### doSubmit = () => {}

This function has the logic to validate user inputs to the captcha component, ex -  if user input matches the generated captcha, the function will show an alert box and redirect the flow page to the next given outcome location.


##### async componentDidMount() {}

This function executes when the component loads in the web browser. 


# Build and Run 

Now you already have the source code of the component, what is missing is the compiled version of the javascript files. Package.json comes handy here. If you look at your package.json it has build and run instructions for each default and default-legacy players.


###### "scripts": {


######     "start": "esbuild ./src/CaptchaNew.tsx --outfile=./build/CaptchaNew.js --sourcemap=both --serve=8080 --servedir=build --bundle --format=esm --watch",


######     "build": "esbuild ./src/CaptchaNew.tsx --outfile=./build/CaptchaNew.js --bundle  --format=esm --target=chrome58,firefox57,safari11,edge16",


######     "startlegacy": "esbuild ./src/CaptchaLegacy.tsx --outfile=./build/CaptchaLegacy.js --sourcemap=both --serve=8080 --servedir=build --bundle --format=esm --watch",


######     "buildlegacy": "esbuild ./src/CaptchaLegacy.tsx --outfile=./build/CaptchaLegacy.js --bundle  --format=esm --target=chrome58,firefox57,safari11,edge16"


######   },

If you go to your VS-Code terminal project root folder and hit _npm run build, _it will build the CaptchaNew.tsx file and make an output in the build folder file named CaptchaNew.js.

In the same way you run npm run buildlegacy it will create CaptchaLegacy.js file inside the project build folder.
