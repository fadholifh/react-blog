import React, { Component } from 'react';
import { connect } from "react-redux";
import { loginUser } from "../../actions/user_actions";

class RegisterLogin extends Component {

    state = {
        email:"",
        password:"",
        errors:[]
    }
    
    displayErrors = errors => {
        errors.map((error, i) => <p key={i} >{error}</p> )
    }

    handleChange = event => {
        this.setState({ [event.target.name]:event.target.value })
    }

    submitForm = event => {
        event.preventDefault();

        let dataToSubmit = {
            email : this.state.email,
            password : this.state.password
        }

        if (this.isFormvalid(this.state)) {
            this.setState({ errors: [] })
                this.props.dispatch(loginUser(dataToSubmit))
                .then(response => {
                    if (response.payload.loginSuccess) {
                        this.props.history.push('/')
                    }else{
                        this.setState({
                            errors: this.setState.errors.concat(
                                "failed to login, check yout email and password"
                            )
                        })
                    }
                }
            )

        } else {
            this.setState({
                errors: this.setState.errors.concat(
                    "form is not valid"
                )
            })
        }
    }

    isFormvalid = ({email, password}) => email && password;

    
    render() {
        return (
            <div className="container">
                <h2>Login</h2>
                <div className="row">
                    <form className="col-12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    type="email" 
                                    name="email"
                                    value={this.state.email} 
                                    onChange={e => this.handleChange(e)}
                                    id="email"
                                    className="validate"
                                />
                                <label htmlFor="email">Email</label>
                                <span 
                                    className="helper-text"
                                    data-error="Type a right email"
                                    data-success="right"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input 
                                    type="password" 
                                    name="password"
                                    value={this.state.password} 
                                    onChange={e => this.handleChange(e)}
                                    id="password"
                                    className="validate"
                                />
                                <label htmlFor="password">Password</label>
                                <span 
                                    className="helper-text"
                                    data-error="Type a right password"
                                    data-success="right"
                                />
                            </div>
                        </div>

                        {this.state.errors.length > 0 && (
                            <div>
                                {this.displayErrors(this.state.errors)}
                            </div>
                        )}

                        <div className="row">
                            <div className="col-12">
                                <button 
                                    className="btn waves-effect red lighten-2" 
                                    type="submit"
                                    name="action"
                                    onClick={this.submitForm}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            Login Page
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        user:state.user
    }
}
export default connect(mapStateToProps)(RegisterLogin);