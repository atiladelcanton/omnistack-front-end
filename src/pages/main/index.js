import React, { Component } from 'react';
import './styles.css';
import {MdFolderShared} from 'react-icons/md';
import logo from '../../assets/logo.svg';
import api from  '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { IoIosAddCircleOutline,IoIosFolder } from "react-icons/io";
import socket from 'socket.io-client';
export default class main extends Component {
    
    state = {
        newBox:'',
        box:''
    }
    async componentDidMount(){
        this.subscribeToNewFolder();
        this.hasPermission();
        const response = await api.get(`boxes`);
        this.setState({box: response.data});
    }
    handleSubmit = async e => {
        e.preventDefault();

        const response = await api.post('boxes',{
            title: this.state.newBox
        });

    }
    hasPermission(){
        if(!('Notification' in window)){
            alert('Esse browser não suporte push notification');
        }else{
            Notification.requestPermission();
        }
        
    }
    notify = (message) => {
        if(Notification.permission == 'granted'){
            var notification = new Notification(message,{body: 'Corra para ver', icon:'http://groupdevs.com/build/images/icon-webapps.png'});
        }
    }
    subscribeToNewFolder = () => {
        const io = socket('https://oministack-atila.herokuapp.com');
        io.emit('connectRoom','atilarampazo_097470428');
        io.on('box', data => {
            
            this.state.box.unshift(data);
            this.setState(
                this.state
              );
            this.notify(`Novo Box Criado: ${data.title}`);
            this.state.newBox = '';
        });
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
                <button type="submit"><IoIosAddCircleOutline /> Criar meu Box</button>
                <div className="list-box">
                    <ul>
                        {this.state.box && 
                        this.state.box.map( box => (
                            <li key={box._id}>
                                <a className="fileInfo" href={'box/'+box._id}>
                                    <IoIosFolder />
                                    <strong>{box.title}</strong>
                                    
                                </a>
                                <span>Há {" "} {distanceInWords(box.createdAt, new Date(), {
                                    locale:pt
                                })}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
            </form>
        </div>
    );
  }
}
