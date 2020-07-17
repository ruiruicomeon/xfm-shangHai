
export function SoftKey3W() {
    const isIE11 = navigator.userAgent.indexOf('Trident') > -1 && navigator.userAgent.indexOf("rv:11.0") > -1;
    const isEDGE = navigator.userAgent.indexOf("Edge") > -1;
    const u = document.URL;
    let url;
    if (u.substring(0, 5) == "https") {
        if (isIE11 || isEDGE) {
            url = "wss://127.0.0.1:4006/xxx";
        }
        else {
            url = "wss://localhost:4006/xxx";
        }
    } else {
        url = "ws://127.0.0.1:4006/xxx";
    }

    let Socket_UK;

    if (typeof MozWebSocket !== "undefined") {
        Socket_UK = new MozWebSocket(url, "usbkey-protocol");
    } else {
        this.Socket_UK = new WebSocket(url, "usbkey-protocol");
    }

    this.FindPort = function (start) {
        const msg =
        {
            FunName: "FindPort",
            start
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.FindPort_2 = function (start, in_data, verf_data) {
        const msg =
        {
            FunName: "FindPort_2",
            start,
            in_data,
            verf_data
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.FindPort_3 = function (start, in_data, verf_data) {
        const msg =
        {
            FunName: "FindPort_3",
            start,
            in_data,
            verf_data
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetVersion = function (Path) {
        const msg =
        {
            FunName: "GetVersion",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetVersionEx = function (Path) {
        const msg =
        {
            FunName: "GetVersionEx",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetID_1 = function (Path) {
        const msg =
        {
            FunName: "GetID_1",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetID_2 = function (Path) {
        const msg =
        {
            FunName: "GetID_2",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };


    this.sRead = function (Path) {
        const msg =
        {
            FunName: "sRead",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWrite = function (InData, Path) {
        const msg =
        {
            FunName: "sWrite",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWrite_2 = function (InData, Path) {
        const msg =
        {
            FunName: "sWrite_2",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWrite_2Ex = function (InData, Path) {
        const msg =
        {
            FunName: "sWrite_2Ex",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWriteEx = function (InData, Path) {
        const msg =
        {
            FunName: "sWriteEx",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWriteEx_New = function (InData, Path) {
        const msg =
        {
            FunName: "sWriteEx_New",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.sWrite_2Ex_New = function (InData, Path) {
        const msg =
        {
            FunName: "sWrite_2Ex_New",
            InData,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetCal = function (Hkey, Lkey, new_Hkey, new_Lkey, Path) {
        const msg =
        {
            FunName: "SetCal",
            Hkey,
            Lkey,
            new_Hkey,
            new_Lkey,
            Path

        };
        this.Socket_UK.send(JSON.stringify(msg));
    };


    this.SetBuf = function (InData, pos) {
        const msg =
        {
            FunName: "SetBuf",
            InData,
            pos
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetBuf = function (pos) {
        const msg =
        {
            FunName: "GetBuf",
            pos
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YRead = function (Address, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YRead",
            Address,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YWrite = function (InData, Address, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YWrite",
            InData,
            Address,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YReadEx = function (Address, len, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YReadEx",
            Address,
            len,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YWriteEx = function (Address, len, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YWriteEx",
            Address,
            len,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YReadString = function (Address, len, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YReadString",
            Address,
            len,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YWriteString = function (InString, Address, HKey, LKey, Path) {
        const msg =
        {
            FunName: "YWriteString",
            InString,
            Address,
            HKey,
            LKey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetWritePassword = function (W_Hkey, W_Lkey, new_Hkey, new_Lkey, Path) {
        const msg =
        {
            FunName: "SetWritePassword",
            W_Hkey,
            W_Lkey,
            new_Hkey,
            new_Lkey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetReadPassword = function (W_Hkey, W_Lkey, new_Hkey, new_Lkey, Path) {
        const msg =
        {
            FunName: "SetReadPassword",
            W_Hkey,
            W_Lkey,
            new_Hkey,
            new_Lkey,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };


    this.DecString = function (InString, Key) {
        const msg =
        {
            FunName: "DecString",
            InString,
            Key
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.EncString = function (InString, Path) {
        const msg =
        {
            FunName: "EncString",
            InString,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.EncString_New = function (InString, Path) {
        const msg =
        {
            FunName: "EncString_New",
            InString,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.Cal = function (Path) {
        const msg =
        {
            FunName: "Cal",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.Cal_New = function (Path) {
        const msg =
        {
            FunName: "Cal_New",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetCal_2 = function (Key, Path) {
        const msg =
        {
            FunName: "SetCal_2",
            Key,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetCal_New = function (Key, Path) {
        const msg =
        {
            FunName: "SetCal_New",
            Key,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetEncBuf = function (InData, pos) {
        const msg =
        {
            FunName: "SetEncBuf",
            InData,
            pos
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetEncBuf = function (pos) {
        const msg =
        {
            FunName: "GetEncBuf",
            pos
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };


    this.ReSet = function (Path) {
        const msg =
        {
            FunName: "ReSet",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetID = function (Seed, Path) {
        const msg =
        {
            FunName: "SetID",
            Seed,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetProduceDate = function (Path) {
        const msg =
        {
            FunName: "GetProduceDate",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.MacAddr = function () {
        const msg =
        {
            FunName: "MacAddr"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };


    this.GetChipID = function (Path) {
        const msg =
        {
            FunName: "GetChipID",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.StarGenKeyPair = function (Path) {
        const msg =
        {
            FunName: "StarGenKeyPair",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GenPubKeyY = function () {
        const msg =
        {
            FunName: "GenPubKeyY"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GenPubKeyX = function () {
        const msg =
        {
            FunName: "GenPubKeyX"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GenPriKey = function () {
        const msg =
        {
            FunName: "GenPriKey"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetPubKeyY = function (Path) {
        const msg =
        {
            FunName: "GetPubKeyY",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetPubKeyX = function (Path) {
        const msg =
        {
            FunName: "GetPubKeyX",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.GetSm2UserName = function (Path) {
        const msg =
        {
            FunName: "GetSm2UserName",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.Set_SM2_KeyPair = function (PriKey, PubKeyX, PubKeyY, sm2UserName, Path) {
        const msg =
        {
            FunName: "Set_SM2_KeyPair",
            PriKey,
            PubKeyX,
            PubKeyY,
            sm2UserName,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YtSign = function (SignMsg, Pin, Path) {
        const msg =
        {
            FunName: "YtSign",
            SignMsg,
            Pin,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YtSign_2 = function (SignMsg, Pin, Path) {
        const msg =
        {
            FunName: "YtSign_2",
            SignMsg,
            Pin,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YtVerfiy = function (id, SignMsg, PubKeyX, PubKeyY, VerfiySign, Path) {
        const msg =
        {
            FunName: "YtVerfiy",
            id,
            SignMsg,
            PubKeyX,
            PubKeyY,
            VerfiySign,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SM2_DecString = function (InString, Pin, Path) {
        const msg =
        {
            FunName: "SM2_DecString",
            InString,
            Pin,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SM2_EncString = function (InString, Path) {
        const msg =
        {
            FunName: "SM2_EncString",
            InString,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.YtSetPin = function (OldPin, NewPin, Path) {
        const msg =
        {
            FunName: "YtSetPin",
            OldPin,
            NewPin,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.FindU = function (start) {
        const msg =
        {
            FunName: "FindU",
            start
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.FindU_2 = function (start, in_data, verf_data) {
        const msg =
        {
            FunName: "FindU_2",
            start,
            in_data,
            verf_data
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.FindU_3 = function (start, in_data, verf_data) {
        const msg =
        {
            FunName: "FindU_3",
            start,
            in_data,
            verf_data
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.IsUReadOnly = function (Path) {
        const msg =
        {
            FunName: "IsUReadOnly",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetUReadOnly = function (Path) {
        const msg =
        {
            FunName: "SetUReadOnly",
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.SetHidOnly = function (IsHidOnly, Path) {
        const msg =
        {
            FunName: "SetHidOnly",
            IsHidOnly,
            Path
        };
        this.Socket_UK.send(JSON.stringify(msg));
    };

    this.ResetOrder = function () {
        const msg =
        {
            FunName: "ResetOrder"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    }

    this.ContinueOrder = function () {
        const msg =
        {
            FunName: "ContinueOrder"
        };
        this.Socket_UK.send(JSON.stringify(msg));
    }

} 