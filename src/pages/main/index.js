import React, { Component } from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import api from  '../../services/api';
export default class main extends Component {
    state = {
        newBox:'',
    }
    handleSubmit = async e => {
        e.preventDefault();
        //console.log(this.state.newBox);
        const response = await api.post('boxes',{
            title: this.state.newBox
        });
        this.props.history.push(`/box/${response.data._id}`);
    }
    handleInputChange = (e) =>{
        this.setState({
            newBox:e.target.value
        });
    }
  render() {
    return (
        <div id="main-container">
            <form onSubmit={this.handleSubmit}>
                <img src={logo} alt="" />
                <input 
                    value={this.state.newBox} 
                    onChange={this.handleInputChange}
                    placeholder="Criar um box" />
                <button type="submit">Criar meu Box</button>
            </form>
        </div>
    );
  }
}
