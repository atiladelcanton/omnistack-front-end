import React, { Component } from 'react';

import logo from '../../assets/logo.svg';
import api from  '../../services/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';
import  Dropzone   from 'react-dropzone';
import { FaFileAlt } from "react-icons/fa";
import './styles.css';

export default class box extends Component {

    state = { box:{}}
    
    async componentDidMount(){
        this.subscribeToNewFiles();
        const box = this.props.match.params.id;
        const response = await api.get(`boxes/${box}`);
        this.setState({box: response.data});

    }
    subscribeToNewFiles = () => {
        
        const box = this.props.match.params.id;
        const io = socket('https://oministack-atila.herokuapp.com');

        io.emit('connectRoom',box);
        io.on('file', data => {
            this.setState({ box: { ... this.state.box, files:[data,...this.state.box.files] } });
            this.notify(`Novo arquivo adicionado: ${data.title}`);
        });
    }
    hasPermission(){
        if(!('Notification' in window)) {
            alert('Esse browser não suporte push notification');
        }
        else {
            Notification.requestPermission();
        }
        
    }
    notify = (message) => {
        if(Notification.permission === 'granted'){
            var notification = new Notification(message,{body: 'Corra para ver', icon:'http://groupdevs.com/build/images/icon-webapps.png'});
        }
    }
    handleUpload = (files) =>{
        files.forEach(file => {
            const data = new FormData();
            const box = this.props.match.params.id;
            data.append('file',file);

            api.post(`boxes/${box}/files`,data);
        });
    }
  render() {
    return (
        <div id="box-container">
            <header>
                <img src={logo} />
                <h1>{this.state.box.title}</h1>
            </header>

            <Dropzone multiple onDropAccepted={this.handleUpload}>
                {({getRootProps,getInputProps}) => (
                    <div className="upload" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Arraste arquivos ou clique aqui</p>
                    </div>
                )}
            </Dropzone>

            <ul>
                {this.state.box.files && 
                this.state.box.files.map( file => (
                    <li key={file._id}>
                        <a className= "fileInfo" href={file.url} target="blank">
                        <FaFileAlt />
                            <strong>{file.title}</strong>
                        </a>
                        <span>Há {" "} {distanceInWords(file.createdAt, new Date(), {
                            locale:pt
                        })}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
  }
}
