import * as React from 'react';
// @ts-ignore
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { FCMCore } from 'fcmlib/lib/FCMCore';
import { FlowOutcome } from 'fcmlib/lib/FlowOutcome';

export class CaptchaModel extends React.Component<any,any> {

    onAccept: FlowOutcome;

    constructor(props: any) {
        super(props);
        this.acceptResult = this.acceptResult.bind(this);
        let parent: FCMCore = this.props.parent;

        if(parent.getAttribute("onAccept")){
            this.onAccept = parent.outcomes[parent.getAttribute("onAccept")];
        }
    }

    async componentDidMount() {
      loadCaptchaEnginge(6,"yellow"); 
    }

    async acceptResult() {
        let parent: FCMCore = this.props.parent;
        
        if (this.onAccept) {
            parent.triggerOutcome(this.onAccept.developerName);
        }
    }
    
    doSubmit = () => {
        let user_captcha = (document.getElementById('user_captcha_input') as HTMLInputElement).value;
 
        if (validateCaptcha(user_captcha)===true) {
            alert('Captcha Matched');
            loadCaptchaEnginge(6,"red"); 
            (document.getElementById('user_captcha_input') as HTMLInputElement).value = "";
            {this.acceptResult()}
        }
 
        else {
            alert('Captcha Does Not Match');
            (document.getElementById('user_captcha_input') as HTMLInputElement).value = "";
        }
    };

    render() {
        let control: any;

        return (<div>
           <LoadCanvasTemplate />
           <div className="field padding-bottom--24">
                
           <input placeholder="Enter Captcha Value" className="input" size={25} id="user_captcha_input" name="user_captcha_input" type="text"/>
                </div>
          
           <div className="field padding-bottom--24">
                <button className="outcome btn btn-primary" onClick={() => this.doSubmit()}>Submit For Captcha</button>
           </div>
     
        </div>);
    };
}