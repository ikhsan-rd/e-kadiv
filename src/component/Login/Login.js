import "../../css/login.scss";
import "../../css/button.scss";
import React,{ useState,useEffect } from "react";
import { Button,Col,Container,Form,Spinner } from "react-bootstrap";
import { Eye,EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from './../../utils/tokenConfig';
import { SansNotify } from '../ComponentCustom/SansComps';
import { SansWelcome } from "../ComponentCustom/Component/SansModal";

function Login()
{
    const [passwordVisible,setPasswordVisible] = useState(false);
    const [nomor_anggota,setNomor_anggota] = useState("");
    const [password,setPassword] = useState("");
    const [rememberMe,setRememberMe] = useState(false);

    useEffect(() =>
    {
        const rememberedUsername = localStorage.getItem("rememberedUsername");
        if (rememberedUsername)
        {
            setNomor_anggota(rememberedUsername);
            setRememberMe(true);
        }
    },[]);

    const togglePasswordVisibility = () =>
    {
        setPasswordVisible(!passwordVisible);
    };

    const handleRememberMeChange = (e) =>
    {
        setRememberMe(e.target.checked);
    };

    //login
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const [status,setStatus] = useState(null);
    const [showNotify,setShowNotify] = useState(false);
    const [successMessage,setSuccessMessage] = useState("");
    const [errorMessage,setErrorMessage] = useState("");

    const handleLogin = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        if (!nomor_anggota || !password)
        {
            setErrorMessage("Masukan Username dan Password!");
            setStatus('error');
            setLoading(false);
            return;
        }

        try
        {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                { nomor_anggota,password }
            );

            if (response.data.access_token)
            {
                setToken(response.data.access_token);
                sessionStorage.setItem("nama",response.data.user.nama);
                sessionStorage.setItem("nomor_anggota",response.data.user.nomor_anggota);
                sessionStorage.setItem("foto",response.data.user.foto);
                sessionStorage.setItem("jabatan",response.data.user.jabatan);
                sessionStorage.setItem("divisi",response.data.user.divisi);

                const saveLoginSuccess = () =>
                {
                    const now = new Date();
                    const item = {
                        value: true,
                        expiry: now.getTime() + 5000, // 5 detik
                    };
                    sessionStorage.setItem('loginBerhasil',JSON.stringify(item));
                };
                saveLoginSuccess();

                // Check if the username has changed or the rememberMe is unchecked
                const rememberedUsername = localStorage.getItem("rememberedUsername");
                if (rememberMe)
                {
                    if (rememberedUsername && rememberedUsername !== nomor_anggota)
                    {
                        localStorage.removeItem("rememberedUsername");
                    }
                    localStorage.setItem("rememberedUsername",nomor_anggota);
                } else
                {
                    if (rememberedUsername)
                    {
                        localStorage.removeItem("rememberedUsername");
                    }
                }

                setSuccessMessage("Login successful!");
                setStatus('success');


                setTimeout(() =>
                {
                    navigate("/dashboard");
                },100);
            } else
            {
                setErrorMessage("Token not received");
                setStatus('error');
                setShowNotify(true);
            }
        } catch (err)
        {
            if (err.response.data.message === 'Username tidak ditemukan')
            {
                setErrorMessage(err.response.data.message);
                console.log('response',err.response)
            } else if (err.response.data.message === 'Password salah')
            {
                setErrorMessage(err.response.data.message);
                console.log('response',err.response)
            }

            else if (err.request)
            {
                setErrorMessage("Tidak terhubung ke server");
                console.log("Response:",err.response);
            } else
            {
                setErrorMessage("Terjadi kesalahan");
                console.log(err.response);
            }
            setErrorMessage("Terjadi kesalahan");
            setStatus('error');
            setShowNotify(true);
        } finally
        {
            setLoading(false);
        }
    };


    const handleCloseNotify = () =>
    {
        setShowNotify(false);

        setTimeout(() =>
        {
            setStatus(null);
        },100);
    };

    return (
        <>
            <Container id="Container"
                style={{
                    marginTop: "10vh"
                }}>
                <Form id="Form" onSubmit={handleLogin}>
                    <Form.Label id="LabelLogin">E-KADIV</Form.Label>
                    <Form.Group as={Col} controlId="formGridUsername">
                        <Form.Label>Nomor Anggota</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="NA.APE.---.USU.--"
                            value={nomor_anggota}
                            onChange={(e) => setNomor_anggota(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Password</Form.Label>
                        <div
                            className="password-wrapper"
                            style={{ marginBottom: "15px" }}
                        >
                            <Form.Control
                                id="eye"
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="secondary"
                                onClick={togglePasswordVisibility}
                                className="toggle-password-button"
                            >
                                {passwordVisible ? (
                                    <Eye className="eye-password" />
                                ) : (
                                    <EyeSlash className="eyeSlash-password" />
                                )}
                            </Button>
                        </div>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Check
                            type="checkbox"
                            label="Remember Me"
                            name="rememberMe"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        style={{ width: "30%",margin: "0 35%" }}
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                    </Button>
                </Form>
            </Container>

            <SansNotify
                show={showNotify}
                onHide={handleCloseNotify}
                status={status}
                onSuccess={successMessage}
                onError={errorMessage}
            />
        </>
    );
}

export default Login;
