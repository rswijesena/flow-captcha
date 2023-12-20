import * as React from 'react';
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, Result } from '@zxing/library';
import './BarcodeScanner.css';
import { FCMCore } from 'fcmlib/lib/FCMCore';
import { FlowOutcome } from 'fcmlib/lib/FlowOutcome';

enum eScanStatus {
    init,
    scanning,
    paused,
    detected,
}

export class BarcodeScanner extends React.Component<any,any> {

    reader: BrowserMultiFormatReader;
    video: any;
    stream: MediaStream;
    code: string;
    type: string;
    scanStat: eScanStatus;
    identifySuccess: boolean = false;

    acceptLabel: string = "Accept";
    cancelLabel: string = "Cancel";
    
    scanCodes: BarcodeFormat[] = [];

    deviceIds: any = {};
    selectedDeviceId: string = "";

    cameras: any[];

    onStop: FlowOutcome;
    onAccept: FlowOutcome;
    onCancel: FlowOutcome;
    onDetect: FlowOutcome;

    constructor(props: any) {
        super(props);
        this.startScan = this.startScan.bind(this);
        this.acceptResult = this.acceptResult.bind(this);
        this.scanStat = eScanStatus.init;
        this.stopScan = this.stopScan.bind(this);
        this.cancel = this.cancel.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
        this.buildCameras = this.buildCameras.bind(this);
        let parent: FCMCore = this.props.parent;

        if(parent.getAttribute("scanFormats")) {
            let formats: string[] = parent.getAttribute("scanFormats").split(",");
            formats.forEach((format: string) => {
                switch(format) {
                    case "QR_CODE":
                        this.scanCodes.push(BarcodeFormat.QR_CODE);
                        break;
                    case "CODE_128":
                        this.scanCodes.push(BarcodeFormat.CODE_128);
                        break;
                    case "CODE_39":
                        this.scanCodes.push(BarcodeFormat.CODE_39);
                        break;
                    case "UPC_EAN_EXTENSION":
                        this.scanCodes.push(BarcodeFormat.UPC_EAN_EXTENSION);
                        break;
                    case "EAN_8":
                        this.scanCodes.push(BarcodeFormat.EAN_8);
                        break;
                    case "EAN_13":
                        this.scanCodes.push(BarcodeFormat.EAN_13);
                        break;
                    case "CODABAR":
                        this.scanCodes.push(BarcodeFormat.CODABAR);
                        break;
                    case "CODE_93":
                        this.scanCodes.push(BarcodeFormat.CODE_93);
                        break;
                    case "AZTEC":
                        this.scanCodes.push(BarcodeFormat.AZTEC);
                        break;
                    case "DATA_MATRIX":
                        this.scanCodes.push(BarcodeFormat.DATA_MATRIX);
                        break;
                    case "ITF":
                        this.scanCodes.push(BarcodeFormat.ITF);
                        break;
                    case "MAXICODE":
                        this.scanCodes.push(BarcodeFormat.MAXICODE);
                        break;
                    case "PDF_417":
                        this.scanCodes.push(BarcodeFormat.PDF_417);
                        break;
                    case "RSS_14":
                        this.scanCodes.push(BarcodeFormat.RSS_14);
                        break;
                    case "RSS_EXPANDED":
                        this.scanCodes.push(BarcodeFormat.RSS_EXPANDED);
                        break;
                    case "UPC_A":
                        this.scanCodes.push(BarcodeFormat.UPC_A);
                        break;
                    case "UPC_E":
                        this.scanCodes.push(BarcodeFormat.UPC_E);
                        break;
                }
            });
        }
        else {
            this.scanCodes.push(BarcodeFormat.QR_CODE);
            this.scanCodes.push(BarcodeFormat.CODE_128);
            this.scanCodes.push(BarcodeFormat.CODE_39);
            this.scanCodes.push(BarcodeFormat.UPC_EAN_EXTENSION);
            this.scanCodes.push(BarcodeFormat.EAN_8);
            this.scanCodes.push(BarcodeFormat.EAN_13);
            this.scanCodes.push(BarcodeFormat.CODABAR);
            this.scanCodes.push(BarcodeFormat.CODE_93);
            this.scanCodes.push(BarcodeFormat.AZTEC);
            this.scanCodes.push(BarcodeFormat.DATA_MATRIX);
            this.scanCodes.push(BarcodeFormat.ITF);
            this.scanCodes.push(BarcodeFormat.MAXICODE);
            this.scanCodes.push(BarcodeFormat.PDF_417);
            this.scanCodes.push(BarcodeFormat.RSS_14);
            this.scanCodes.push(BarcodeFormat.RSS_EXPANDED);
            this.scanCodes.push(BarcodeFormat.UPC_A);
            this.scanCodes.push(BarcodeFormat.UPC_E);
        }
        if(parent.getAttribute("onAccept")){
            this.onAccept = parent.outcomes[parent.getAttribute("onAccept")];
            this.acceptLabel = this.onAccept.label;
        }
        if(parent.getAttribute("onCancel")){
            this.onCancel = parent.outcomes[parent.getAttribute("onCancel")];
            this.cancelLabel = this.onCancel.label;
        }
        if(parent.getAttribute("onDetect")){
            this.onDetect = parent.outcomes[parent.getAttribute("onDetect")];
        }
        if(parent.getAttribute("onStop")){
            this.onStop = parent.outcomes[parent.getAttribute("onStop")];
        }
        
    }

    async componentDidMount() {
        
        const video = this.video;
        const self = this;
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, this.scanCodes);
        this.reader = new BrowserMultiFormatReader(hints);
     
        let devices = await navigator.mediaDevices.enumerateDevices(); 
        for (var i = 0; i !== devices.length; ++i) {
            var deviceInfo = devices[i];
            if (deviceInfo.kind === 'videoinput') {
                this.deviceIds[deviceInfo.deviceId] =  deviceInfo;
                if(this.selectedDeviceId === "") {
                    this.selectedDeviceId=deviceInfo.deviceId;
                }
            }
        }
        
        self.forceUpdate();
        await self.buildCameras();
        self.startScan();
        
    }

    async acceptResult() {
        let parent: FCMCore = this.props.parent;
        if (this.onAccept) {
            parent.triggerOutcome(this.onAccept.developerName);
        }
    }

    async startScan() {
        if (this.scanStat === eScanStatus.scanning) {
            console.log('already scanning - can\'t start');
            this.forceUpdate();
        }
        else {
  
            this.scanStat = eScanStatus.scanning;
            this.forceUpdate();
            let result: Result = await this.reader.decodeOnceFromVideoDevice(this.selectedDeviceId, this.video) //Once(this.video); //FromStream(this.stream, this.video);//  decodeOnce(this.video);
            this.reader.stopAsyncDecode();

            this.code = result.getText();

            let parent: FCMCore = this.props.parent;
            parent.setStateValue(this.code);
            
            this.scanStat = eScanStatus.detected;
            this.forceUpdate();

            // if outcome detected trigger it
            if (this.onDetect) {
                parent.triggerOutcome(this.onDetect.developerName);
            }
            
        }
    }

    async stopScan() {
        if (this.scanStat !== eScanStatus.scanning) {
            console.log('not scanning - can\'t stop');
            this.forceUpdate();
        } else {
            this.reader.stopAsyncDecode();
            this.scanStat = eScanStatus.paused;
            this.forceUpdate();
        }
    }

    async cancel() {
        await this.stopScan();
        let parent: FCMCore = this.props.parent;
        if (this.onCancel) {
            parent.triggerOutcome(this.onCancel.developerName)
        }
    }

    async switchCamera(deviceId: string) {
        await this.stopScan();
        this.selectedDeviceId = deviceId;
        await this.buildCameras();
        this.startScan();
    }

    async buildCameras() : Promise<any> {

        this.cameras=[];
        
        for(let deviceId of Object.keys(this.deviceIds)) {
            let classes: string = "glyphicon glyphicon-camera bcs-ctl-cambar-cam ";
            if(this.selectedDeviceId === deviceId) {
                classes += "bcs-ctl-cambar-cam-active"
            }
            
            this.cameras.push(
                
                <div
                    key={deviceId}
                    onClick={(e: any) => {this.switchCamera(deviceId)}}
                >
                    <span 
                        className={classes}
                    /> 
                </div>
            );
        }
        
        return true;
    }

    render() {
        let parent: FCMCore = this.props.parent;
        const text: string = parent.label;
        let control: any;
        let result: any;
        let message: string = "";

        

        const buttons: any = [];
        switch (this.scanStat) {
            case eScanStatus.init:
                message = 'Initialising';
                break;

            case eScanStatus.scanning:
                
                let cancelAction: any;
                if (this.onCancel) {
                    cancelAction = this.cancel;
                }
                else {
                    cancelAction = this.stopScan;
                }
                
                message = 'Scanning';
                buttons.push(
                    <button
                        className="bcs-ctl-btnbar-btn"
                        onClick={cancelAction}
                        key="cancel"
                    >
                        {this.cancelLabel}
                    </button>,
                );
                break;

            case eScanStatus.paused:
                message = 'Paused';
                buttons.push(
                    <button
                        className="bcs-ctl-btnbar-btn"
                        onClick={this.startScan}
                        key="start"
                    >
                        Re-Scan
                    </button>,
                );
                break;

            case eScanStatus.detected:
                    message = 'Code Detected';
                    buttons.push(
                        <button
                            className="bcs-ctl-btnbar-btn"
                            onClick={this.startScan}
                            key="start"
                        >
                            Re-Scan
                        </button>,
                    );
                    buttons.push(
                        <button
                            className="bcs-ctl-btnbar-btn"
                            onClick={this.acceptResult}
                            key="accept"
                        >
                            {this.acceptLabel}
                        </button>,
                    );
                    result = this.code;
                    break;
        }
        
        
        control = (
            <div
                className="bcs-ctl"
            >
                <div
                    className="bcs-ctl-msgbar"
                >
                    <span
                        className="bcs-ctl-msgbar-label"
                    >
                        {message}
                    </span>
                </div>
                <div
                    className="bcs-ctl-msgbar"
                >
                    <span
                        className="bcs-ctl-msgbar-label"
                    >
                        {result}
                    </span>
                </div>
                <div
                    className="bcs-ctl-btnbar"
                >
                    {buttons}
                </div>
                <div
                    className="bcs-ctl-cambar"
                >
                    {this.cameras}
                </div>
            </div>
        );

        let style: React.CSSProperties = {};

        let classes: string = "bcs " + parent.getAttribute("classes","");

        if(parent.isVisible === false) {
            style.display = "none";
        }
        if(parent.width) {
            style.width=parent.width + "px"
        }
        else {
            style.width="auto"
        }
        if(parent.height) {
            style.height=parent.height + "px"
        }
        else {
            style.height="auto"
        }

        return (
            <div 
                className="bcs"
                id={parent.id}
            >
                <video 
                    ref={(me: any) => {this.video = me; }} 
                    className="bcs-video" 
                    autoPlay={true}                    
                />
                {control}
            </div>
        );
    }

}
