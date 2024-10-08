import {useEffect, useRef, useState} from "react";
import BigNumber from "bignumber.js";
import axios, {all} from "axios";
import Image from "next/image";
import NaboxWindow from "../types/NaboxWindow";
import {LuExternalLink} from "react-icons/lu";
import Link from "next/link";
//import styles from '../../styles/Creator/MyPage/MyPage.module.css'
//import { ConnectButton } from '@rainbow-me/rainbowkit';
//import Link from "next/link";
//import {useAccount} from "wagmi";
/*import {
    Button,
    Typography,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";*/
//import { FaHouse } from "react-icons/fa6";
//import {GoHome, GoSearch} from "react-icons/go";

//import { FaAngleDown } from "react-icons/fa";
/*


*/

interface Props{
    display:boolean,
    displayToggle:any
    project:any
    coin:any
}
export const ModalInvest: React.FC<Props>  = ({display, displayToggle, project, coin}) => {

    const [balanceNuls, setBalanceNuls] = useState("")
    const [balanceToken, setBalanceToken] = useState("")
    const [valueIn, setValueIn] = useState("0")
    const [pricePerNuls, setPricePerNuls] = useState("0")
    const [alreadyRaised, setAlreadyRaised] = useState("0")

    const [account, setAccount] = useState("")

    const [transactionUrl, setTransactionUrl] = useState("")
    const [submitting, setSubmitting] = useState<boolean>(false);

    const isMounted = useRef(false);

    const ip1 = "https://api.nuls.io/";



    useEffect(() =>{

        async function getTokenBalance() {

            const naboxInfo:any = await (window as unknown as NaboxWindow).nabox.createSession();
            console.log(naboxInfo)
            const address = naboxInfo[0];
            setAccount(address)
            return new Promise((resolve, reject) => {
                BigNumber.config({ DECIMAL_PLACES: 8 });

                axios
                    .post(
                        ip1 + "api/accountledger/balance/" + address,
                        {
                            assetChainId: 1,
                            assetId: 1,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then(function (response) {
                        var data = response.data;
                        let amountBal = data.data.available;
                       /* var displayBal = new BigNumber(amountBal)
                            .dividedBy(Math.pow(10, 8))
                            .toString();*/
                        setBalanceNuls(amountBal)

                    })
                    .catch(function (error) {});

            });
        }
        getTokenBalance()
        async function getUserBalance(account: string) {
            const data = {
                contractAddress: coin.tokenAddr,
                methodName: "getUserBalance",
                methodDesc: "(Address addr) return BigInteger",
                args: [account],
            };
            const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
            return res.result;
        }


        async function getPricePerNuls() {
            const data = {
                contractAddress: coin.raiseAddr,
                methodName: "pricePerNuls",
                methodDesc: "() return BigInteger",
                args: [],
            };
            const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
            setPricePerNuls(res.result)
            return res.result;
        }

        getPricePerNuls()

        async function getAlreadyRaised() {
            const data = {
                contractAddress: coin.raiseAddr,
                methodName: "amountRaised",
                methodDesc: "() return BigInteger",
                args: [],
            };
            const res = await (window as unknown as NaboxWindow).nabox.invokeView(data);
            setAlreadyRaised(res.result)
            return res.result;
        }

        getAlreadyRaised()

    },[])

    useEffect(() => {
        if (isMounted.current) {
            if (transactionUrl !== "") {
                setSubmitting(true);
                const timeout = setTimeout(() => {
                    setSubmitting(false);
                }, 11200);
                return () => clearTimeout(timeout);
            }
        } else {
            isMounted.current = true;
        }
    }, [transactionUrl]);

    async function max(){

        setValueIn(new BigNumber(balanceNuls).dividedBy(Math.pow(10, 8))
            .toString())

    }


    async function buyTokens(
        amount: string,
    ) {
        const data = {
            from: account,
            value: amount,
            contractAddress: coin.raiseAddr,
            methodName: "buyTokens",
            methodDesc:
                "(Address onBehalfOf, BigInteger amount) return void",
            args: [account?.toString(), BigNumber(amount).multipliedBy(Math.pow(10, 8))?.toString()],
        };
        const res = await (window as unknown as NaboxWindow).nabox.contractCall(data).then((res: any) =>{
                setTransactionUrl(res)
                displayToggle(false)
        });
        ;
    }







    return(
        <>
            <div style={{
            position:"fixed",
            top:"0vh",
            left:"0%",
            width:"100%",
            height:"100%",
            backgroundColor:"rgba(0,0,0,0.5)",
            display:(display) ? "block" : "none",
        }} onClick={(e) => {
            if(e.target === e.currentTarget)
                displayToggle(false);
        } } >
            <div className={""} style={{
                backgroundImage: "linear-gradient(180deg,#0c111c,#0f1421 14.87%,#10131a 29.77%,#19191b 50%)",
                borderRadius:"10px",
                position:"fixed",
                top:"29vh",
                left:"37.5%",
                width:"25%",
                minWidth:"280px",
                height:"360px",
                color:"white",
                padding:"10px",
                boxShadow: "0px 2px 8px -1px white",
                display: (display) ? "block" : "none",
                fontFamily: "Arimo"
            }} onClick={() =>{}}>
                <div >
                    <div style={{textAlign:"center", padding:"10px 0px 20px 0px"}}>
                        <h1>Donate</h1>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
                        <div>Balance:</div>
                        <div>{new BigNumber(balanceNuls)
                            .dividedBy(Math.pow(10, 8))
                            .toString() + "NULS"}</div>
                    </div>
                    <div style={{display:"flex", backgroundColor:"white", borderRadius:"8px", marginTop:"6px", padding:"0px 0px"}}>
                        <div style={{width:"calc(100% - 50px)",  borderRadius:"8px"}}>
                            <input id="investAmount" style={{padding:"10px",
                                border:"0px",
                                outline:"none",
                                width:"100%",
                                borderRadius:"4px",
                                fontSize:"16px"
                            }} type="number" value={valueIn} onChange={(e) => setValueIn(e.target.value)} placeholder="Ex: 100 NULS" min="1"/>
                        </div>
                        <div style={{width:"50px"}}>
                            <button
                                onClick={() => max()}
                                style={{padding:"10px", border:"0px", fontWeight:"bold", cursor:"pointer", backgroundColor:"transparent"}}>Max</button>
                        </div>
                    </div>
                    <div style={{padding:"10px 0px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", padding:"10px 0px"}}>
                            <div>
                                Total Amount of Tokens:
                            </div>
                            <div>
                                {new BigNumber(valueIn).multipliedBy(pricePerNuls)?.toString()} {coin.symbol}
                            </div>
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", padding:"10px 0px"}}>
                            <div>
                                Already Raised:
                            </div>
                            <div>
                                {new BigNumber(alreadyRaised).dividedBy(Math.pow(10,8))?.toString()} NULS
                            </div>
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", padding:"10px 0px"}}>
                            <div>
                                Price per Nuls:
                            </div>
                            <div>
                                {pricePerNuls?.toString()} {coin.symbol}
                            </div>
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between", padding:"5px 0px"}}>
                            <div>
                                Project:
                            </div>
                            <div>
                                {coin.projectName}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",textAlign:"center"}}>
                        <button onClick={() => displayToggle(false)} style={{backgroundColor:"white", color:"black", padding:"5px 10px", borderRadius:"5px", cursor:"pointer", width:"50%"}}>Cancel</button>
                        <button onClick={() => buyTokens(valueIn)} style={{padding:"8px 10px", borderRadius:"5px", cursor:"pointer", color:"white", width:"50%", backgroundColor:"rgb(50, 224, 141)", border:"0px"}}>Donate</button>
                    </div>
                </div>

            </div>
        </div>
            <div style={{position:"fixed", display:(submitting) ? "block" : "none",padding:"10px 20px", borderRadius:"4px", backgroundColor:"rgba(50, 224, 141, 0.6)", top:"70px", right:"10px"}}>

                <Link href={"https://nulscan.io/transaction/info?hash="+ transactionUrl} target="_blank">
                    <div style={{ display:"flex", alignItems:"center"}}>
                        <div style={{textDecoration:"underline", cursor:"pointer"}}>
                            Tx Submitted, wait a few seconds
                        </div>
                        <div style={{padding:"0px 8px"}}>
                            <LuExternalLink />
                        </div>
                    </div>

                </Link>
            </div>
</>
    )
}