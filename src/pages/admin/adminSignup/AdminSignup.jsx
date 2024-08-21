import React, { useContext , useState} from "react";
import {Card,CardHeader,CardBody,Input,Button,Typography,} from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, fireDb } from "../../../firebase/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";



export default function AdminLogin() {

    const context = useContext(myContext);
    const { mode } = context;

    const naviagate = useNavigate();

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");      
    const [profession, setProfession] = useState("");


    const signup = async () => {
        if(!email || !password || !confirmPassword || !fullName || !profession){
            alert("Fill all the Inputs");
        }
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(fireDb, "users", user.uid), {
                fullName,
                profession,
                email,
                uid : user.uid
            });
            naviagate('/adminlogin')
        } catch(error){
            alert("There is some error");
            console.log(error);
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">

            {/* Card  */}
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === 'dark'
                        ? 'rgb(30, 41, 59)'
                        : 'rgb(226, 232, 240)'
                }}
            >
                {/* CardHeader */}
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === 'dark'
                            ? 'rgb(226, 232, 240)'
                            : 'rgb(30, 41, 59)'
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className=" flex justify-center">
                            {/* Image  */}
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20" alt="img"
                            />
                        </div>
                    </div>

                    {/* Top Haeding  */}
                    <Typography variant="h4" style={{
                        color: mode === 'dark'
                            ? 'rgb(30, 41, 59)'
                            : 'rgb(226, 232, 240)'
                    }}>
                        Admin Signup
                    </Typography>
                </CardHeader>

                {/* CardBody */}
                <CardBody>
                    <form className=" flex flex-col gap-4">
                        {/* First Input  */}
                        <div>
                            <Input
                                type="text"
                                label="Full Name"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                type="text"
                                label="Profession"
                                name="profession"
                                value={profession}
                                onChange={(e) => setProfession(e.target.value)}
                            />
                        </div>
                        <div>
                            <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Second Input  */}
                        <div>
                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Third Input  */}
                        <div>
                            <Input
                                type="password"
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {/* Login Button  */}
                        <Button
                            onClick={signup}
                            style={{
                                background: mode === 'dark'
                                    ? 'rgb(226, 232, 240)'
                                    : 'rgb(30, 41, 59)',
                                color: mode === 'dark'
                                    ? 'rgb(30, 41, 59)'
                                    : 'rgb(226, 232, 240)'
                            }}>
                            Signup
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>


    );
} 