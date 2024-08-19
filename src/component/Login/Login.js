import "../../css/login.scss";
import "../../css/button.scss";
import React,{ useState,useEffect } from "react";
import { Button,Col,Container,Form } from "react-bootstrap";
import { Eye,EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login()
{
    const [passwordVisible,setPasswordVisible] = useState(false);
    const [nomor_anggota,setNomor_anggota] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [success,setSuccess] = useState(null);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() =>
    {
        const rememberedUsername = localStorage.getItem("rememberedUsername");
        if (rememberedUsername)
        {
            setNomor_anggota(rememberedUsername);
        }
    },[]);

    const togglePasswordVisibility = () =>
    {
        setPasswordVisible(!passwordVisible);
    };

    const formatLocalTime = () =>
    {
        const now = new Date();
        const day = String(now.getDate()).padStart(2,'0');
        const month = String(now.getMonth() + 1).padStart(2,'0');
        const year = now.getFullYear().toString().slice(-2); // Ambil 2 digit terakhir tahun
        const hours = String(now.getHours()).padStart(2,'0');
        const minutes = String(now.getMinutes()).padStart(2,'0');
        return `${day}-${month}-${year} | ${hours}:${minutes}`;
    };

    const handleLogin = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        try
        {
            const formattedLocalTime = formatLocalTime();

            const response = await axios.post(
                "http://localhost:8000/api/login",
                {
                    nomor_anggota,
                    password,
                    localTime: formattedLocalTime
                }
            );

            console.log("API Response:",response); // Log full response
            console.log("Token from Response:",response.data.access_token); // Log token

            if (response.data.access_token)
            {
                localStorage.setItem("token",response.data.access_token);
                localStorage.setItem("nomor_anggota",response.data.user.nomor_anggota);
                localStorage.setItem("foto",response.data.user.foto);
                localStorage.setItem("jabatan",response.data.user.jabatan);

                console.log("Token Stored:",localStorage.getItem("token"));
                console.log("Nomor Stored:",localStorage.getItem("nomor_anggota"));
                console.log("Foto Stored:",localStorage.getItem("foto"));
                console.log("Jabatan Stored:",localStorage.getItem("jabatan"));

                setSuccess("Login successful!");
                setError(null);
            } else
            {
                setError("Token not received.");
            }
            setTimeout(() =>
            {
                navigate("/dashboard");
            },100);
        } catch (err)
        {
            setError("Login failed. Please try again.");
            setSuccess(null);
            console.error("Error:",err);
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <Container id="Container">
            <Form id="Form" onSubmit={handleLogin}>
                <Form.Label id="LabelLogin">E-KADIV</Form.Label>
                {error && <p style={{ color: "red" }}>{error}</p>}
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
                <Form.Group as={Col} id="formGridCheckbox">
                    <Form.Check
                        type="checkbox"
                        label="Remember Me"
                        name="rememberMe"
                        id="rememberMe"
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    style={{ width: "30%",margin: "0 35%" }}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
