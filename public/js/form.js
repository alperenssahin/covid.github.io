class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iller: [],
            ilceller: [],
            hastaneler: [],
            map: {},
            ilceData: "",
            ilData: "",
            hastaneData: "",
            yeniHastane: [],
            yeniHastaneBool: false,
            commInfo: [],
            ad: '',
            soyad: '',
            telefon: "",
            email: "",
            matrixData: [<div className={"matrix-element"}>
                <strong>0 -</strong>
                <input id={"matrix-item-name-0"} className={"item"} placeholder={"Malzeme Adı*"} type={"text"}/>
                <input id={"matrix-item-miktar-0"} className={"miktar"} placeholder={"Miktar*"} type={"number"}/>
                <input id={"matrix-item-aciklama-0"} className={"aciklama"} placeholder={"Açıklama"} type={"text"}/>
            </div>,],
            matrixCounter: 1,
            matrixBool: false,
        }
    }

    componentWillMount() {
        firebase.database().ref("/map").once("value").then(s => {
            this.setState({map: s.val()});
            this.setState({iller: this.fillSelector(this.state.map, "iller-select-box", this.ilSelected)});
        });
    }

    componentDidMount() {
        document.getElementById("add-new-item").addEventListener("click", this.addNewItemHandler.bind(this));
    }

    componentWillUnmount() {
        document.getElementById("add-new-item").removeEventListener("click", this.addNewItemHandler.bind(this));
    }

    addNewItemHandler() {
        let m = this.state.matrixData.slice();
        m.push(<div className={"matrix-element"}>
            <strong>{this.state.matrixCounter} -</strong>
            <input id={"matrix-item-name-" + this.state.matrixCounter} className={"item"} placeholder={"Malzeme Adı*"}
                   type={"text"}/>
            <input id={"matrix-item-miktar-" + this.state.matrixCounter} className={"miktar"} placeholder={"Miktar*"}
                   type={"number"}/>
            <input id={"matrix-item-aciklama-" + this.state.matrixCounter} className={"aciklama"}
                   placeholder={"Açıklama"} type={"text"}/>
        </div>);
        this.setState({matrixData: m, matrixCounter: this.state.matrixCounter + 1});
    }

    ilSelected = (e) => {
        this.setState({ilData: e.target.value});
        this.setState({
            ilceData: "",
            ilceler: [], hastaneler: [], hastaneData: "",
            yeniHastane: [],
            yeniHastaneBool: false,
        }, () => {
            firebase.database().ref(`/data/${this.state.ilData}/ilceler`).once("value").then(s => {
                this.setState({ilceler: this.fillSelector(s.val(), "ilceler-select-box", this.ilceSelected)})
            });
        });
    };
    ilceSelected = (e) => {
        this.setState({
            ilcetData: document.getElementById(e.target.value).textContent,
            ilceData: e.target.value,
            hastaneler: [], hastaneData: "",
            yeniHastane: [], yeniHastaneBool: false,
        }, () => {
            firebase.database().ref(`/data/${this.state.ilData}/ilceler/${this.state.ilceData}/hastaneler`).once("value").then(s => {
                this.setState({hastaneler: this.fillSelector(s.val(), "hastane-select-box", this.hastaneSelected)});
            });
        });
    };
    hastaneSelected = (e) => {
        if (e.target.value === "yeniHastane") {
            let dom = <div className={"yeni-hastane-container"}>
                <strong>Seçtiğiniz il-ilçe'de bulunmayan hastanenin adını ve adresini girerek devam et butonuna
                    tıklayınız!</strong>
                <br/>
                <input placeholder={"Yeni Hastane Adi"} id={"yeni-hastane-ad-input"}/><br/>
                <input placeholder={"Yeni Hastane Adresi"} id={"yeni-hastane-adress-input"}/><br/>
                <button onClickCapture={() => {
                    let hastaneAdi = document.querySelector("#yeni-hastane-ad-input").value;
                    let hastaneAdresi = document.querySelector("#yeni-hastane-adress-input").value;
                    firebase.database().ref(`/data/${this.state.ilData}/ilceler/${this.state.ilceData}/hastaneler`).push({
                        title: hastaneAdi,
                        address: hastaneAdresi
                    }).then(() => {
                        this.setState({hastaneData: hastaneAdi, yeniHastaneBool: true, yeniHastane: []}, () => {
                            this.commInfoCall();
                        });
                    });
                }}>Devam Et
                </button>
            </div>;
            this.setState({yeniHastaneBool: true, yeniHastane: dom});
        } else {
            this.setState({
                hastaneData: document.getElementById(e.target.value).textContent,
                yeniHastaneBool: false,
                yeniHastane: []
            }, () => {
                this.commInfoCall();
            });
        }
    };

    commInfoCall() {
        let dom = <div className={"comm-info-container"}>
            <h3>İletişim Bilgilerinizi Eksiksiz Doldurun</h3>
            <hr/>
            <input id={"ad-input"} placeholder={"Ad"} type={"text"} onChangeCapture={(e) => {
                this.setState({ad: e.target.value});
            }}/><br/>
            <input id={"soyad-input"} placeholder={"Soyad"} type={"text"} onChangeCapture={(e) => {
                this.setState({soyad: e.target.value});
            }}/><br/>
            <input id={"telefon-input"} placeholder={"Telefon"} type={"tel"} onChangeCapture={(e) => {
                this.setState({telefon: e.target.value});
            }}/><br/>
            <input id={"mail-input"} placeholder={"E-mail"} type={"email"} onChangeCapture={(e) => {
                this.setState({ad: e.target.email});
            }}/><br/>

        </div>;
        this.setState({commInfo: dom, matrixBool: true});
    }

    fillSelector(data, id, callback) {
        let options = [<option value={"-"} id={"-"}>Seciniz</option>];
        for (let key in data) {
            options.push(<option value={key} id={key}>{data[key].title}</option>)
        }
        return <div className={"select-box-container"}><select className={"select-box"} id={id}
                                                               onChangeCapture={(e) => {
                                                                   callback(e);
                                                               }}>{options}</select></div>
    }

    render() {
        // console.log(this.state.ilData, this.state.ilceData, this.state.hastaneData);
        return (
            <div className={"form-container"}>
                <div className={"form-inside"}>
                    <div className={"address-container"}>
                        <h2>Hastane Seçimi</h2>
                        <h4 className={"colored"}>il,ilce ve hastane seçiniz</h4>
                        <hr/>
                        <div className={"address-inside"}>
                            {this.state.iller}
                            {this.state.ilceler}
                            {this.state.hastaneler}
                            {this.state.yeniHastane}
                        </div>
                        <hr/>
                        <h4 className={"bread"}>
                            Seçiminiz:<br/>
                            {this.state.ilData} <span>--></span> {this.state.ilcetData}
                            <span>--></span> {this.state.hastaneData}
                        </h4>
                    </div>
                    <div className={"comm-container"}>
                        <div className={"comm-inside"}>
                            {this.state.commInfo}


                        </div>
                    </div>
                    <div className={"matrix-container " + this.state.matrixBool}>
                        <div className={"matrix-inside"}>
                            <h2>İhtiyaç Listesini Doldurunuz</h2>
                            <h5 className={"colored"}>(* ile biten alanlarin doldurulmasi zorunludur, ekle butonuna basarak yeni malzeme
                                girdisi ekleyebilirisiniz)</h5>
                            <hr/>
                            <div className={"matrix-inner-container"}>
                                <div className={"matrix-element"}>
                                    <p className={"first"}>No.</p>
                                    <p className={"full"}>Malzeme Adı*</p>
                                    <p className={"full"}>Miktar*</p>
                                    <p className={"full"}>Açıklama</p>
                                </div>
                                <hr/>
                                {this.state.matrixData}
                                <button id={"add-new-item"}>Ekle</button>
                            </div>
                        </div>
                    </div>
                    <button className={"" + this.state.matrixBool} onClickCapture={() => {
                        let obj = {
                            il: this.state.ilData,
                            ilce: this.state.ilcetData,
                            hastane: this.state.hastaneData,
                            ad: this.state.ad,
                            soyad: this.state.soyad,
                            telefon: this.state.telefon,
                            email: this.state.email,
                            liste: []
                        };
                        for (let i = 0; i < this.state.matrixCounter; i++) {
                            let name = document.querySelector("#matrix-item-name-" + i).value;
                            let miktar = document.querySelector("#matrix-item-miktar-" + i).value;
                            let aciklama = document.querySelector("#matrix-item-aciklama-" + i).value;
                            let inObj = {
                                isim: name, miktar: miktar, aciklama: aciklama
                            };
                            obj.liste.push(inObj);
                        }
                        console.log(obj);
                    }}>Gönder
                    </button>
                </div>
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(<Form/>, domContainer);