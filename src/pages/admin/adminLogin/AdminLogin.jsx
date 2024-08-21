import React, { useContext, useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Input, Button, Typography, } from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/FirebaseConfig";
import Loader from "../../../components/loader/Loader";

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/dashboard');
            }
            setInitialLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);


    
    const login = async () => {
        if (!email || !password) {
            return alert("fill the inputs");
        }
        try {
            setLoading(true);
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('admin', JSON.stringify(result));
            setLoading(false);
            navigate('/dashboard');
        } catch (error) {
            alert("Some Error");
            console.log(error);
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Loader />;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                }}
            >
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)'
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className=" flex justify-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/727/727399.png" className="h-20 w-20" alt="img" />
                        </div>
                    </div>
                    <Typography variant="h4" style={{
                        color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                    }}>
                        Admin Login
                    </Typography>
                </CardHeader>

                <CardBody>
                    <form className=" flex flex-col gap-4">
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {loading ? <Loader /> :
                            <Button
                                onClick={login}
                                style={{
                                    background: mode === 'dark' ? 'rgb(226, 232, 240)' : 'rgb(30, 41, 59)',
                                    color: mode === 'dark' ? 'rgb(30, 41, 59)' : 'rgb(226, 232, 240)'
                                }}>
                                Login
                            </Button>
                        }
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
