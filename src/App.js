import './App.css';
import React, {Component} from 'react';
import {Switch, Route} from 'react-router'
import {Redirect} from 'react-router-dom'
import NavBar from './Components/NavBar'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'
import Profile from './Components/Profile'
import ChangeInfo from './Components/ChangeInfo'
import Default from './Components/Default'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Homebody from './Components/Homebody';
import axios from 'axios'
import Offers from './Components/Offers';
import Companyprofile from './Components/Companyprofile'
import CompanyHome from './Components/Company/CompanyHome'

class App extends Component {  
  state = {
    currentUserInfo:{},
    isAuthenticated:false
  }

  //Change Informations
  changeInfo = (data, props) => {
    let status = 0
    const username = data.username 
    const email = data.email 
    const password = data.password
    const city = data.city 
    const town = data.town
    const type = data.type
    const logo = data.logo
    const id = data.id

    console.log(data)
    fetch(`https://your-products-manager.herokuapp.com/api/user/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username,email,password, city, town, type, logo})
    
    }).then(response => {status = response.status; return response.json()})
      .then(data => {
        if(status === 200){
          this.setState({currentUserInfo:data,isAuthenticated:true});
          toast.success('your information has been successfully changed', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
          props.history.replace('/profile');

        }
        else{
          console.log(data.message)
          toast.error(data.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        }
      })  
  }

  //register function
  registerHandler = (data,props,url) =>{
    let status = 0
    const username = data.username 
    const email = data.email 
    const password = data.password

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username,email,password})
    
    }).then(response => {status = response.status; return response.json()})
      .then(data => {
        if(status === 200){
          this.setState({currentUserInfo:data,isAuthenticated:true});
          toast.success('registered', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            props.history.replace('/');
        }
        else{
          console.log(data.message)
          toast.error(data.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        }
      })   
  }

  //login function
  loginHandler = (data,props) =>{
    let status = 0
    fetch('https://your-products-manager.herokuapp.com/api/user/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {status = response.status; return response.json()})
      .then(data => {
        if(status === 200){
          this.setState({currentUserInfo:data,isAuthenticated:true});
          toast.success('logged in', {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
            props.history.replace('/');
        }
        else{
          console.log(data.message)
          toast.error(data.message, {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        }
      })   
  }

  //sign out function
  signOutHandler = () => {
    this.setState({currentUserInfo:{},isAuthenticated:false});
  }
  

  render(){
    const res =  axios.get('https://your-products-manager.herokuapp.com/api/company');
    const isAuthenticated = this.state.isAuthenticated;
    return (
      <div className="App">
        <NavBar currentUserInfo = {this.state.currentUserInfo} 
                  isAuthenticated = {this.state.isAuthenticated}
                  signOutHandler = {this.signOutHandler}
          />
        <ToastContainer/>
        <Switch> 
              <Route exact path='/' render={ props =>{
                return !isAuthenticated ?  <Redirect to="/login" /> : <Homebody></Homebody>;
              }}>
              </Route>
              <Route path='/comprofile' render={ props =>{
                return !isAuthenticated ?  <Redirect to="/login" /> : <Companyprofile></Companyprofile>;
              }}>
              </Route>
              <Route path='/companyHome' render={ props =>{
                return isAuthenticated ?  <Redirect to="/login" /> : <CompanyHome userInfo={this.state.currentUserInfo}/>;
              }}>
              </Route>
             <Route path='/register' render={ props =>{
                return isAuthenticated ?  <Redirect to="/login" /> : <Register registerHandler = {this.registerHandler} {...props}/>;
              }}>
              </Route>
              <Route path='/login' render={ props => {
                return isAuthenticated ?  <Redirect to="/login" /> : <Login loginHandler = {this.loginHandler} {...props}/>;
              }}>
              </Route>
              <Route path='/Profile' render={ props =>{
                return !isAuthenticated ?  <Redirect to="/login" /> : <Profile userInfo = {this.state.currentUserInfo} changeInfo={this.changeInfo} {...props}/>;
              }}>
              </Route>
              <Route path='/changeInfo' render={ props =>{
                return !isAuthenticated ?  <Redirect to="/login" /> : <ChangeInfo userInfo = {this.state.currentUserInfo} changeInfo={this.changeInfo} {...props}/>;
              }}>
              </Route>
              <Route component={Default}/>
        </Switch>
      </div>
    )
  }
}

export default App;
