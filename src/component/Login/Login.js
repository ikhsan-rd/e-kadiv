import "../../css/login.scss";
import "../../css/button.scss";
import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [nomor_anggota, setNomor_anggota] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rememberedUsername = localStorage.getItem("rememberedUsername");
        if (rememberedUsername) {
            setNomor_anggota(rememberedUsername);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                {
                    nomor_anggota,
                    password,
                }
            );
            localStorage.setItem("token", response.data.token);
            setSuccess("Login successful!");
            setError(null);
            alert("Login successful! Redirecting to Homepage...");
            setTimeout(() => {
                navigate("/");
            }, 100);
        } catch (err) {
            setError("Login failed. Please try again.");
            setSuccess(null);
            alert("Login failed. Please try again.");
        }
        setLoading(false);
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
                    style={{ width: "30%", margin: "0 35%" }}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
