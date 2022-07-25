/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

var url = 'https://jorxel.com/test/';
var bkTk = '';
$(document).on("focus",".it",(e)=>{
    $(e.target).parent().children("label").removeClass("up-text");

});
$(document).on("focusout",".it",(e)=>{
    if($(e.target).val() == ""){
        $(e.target).parent().children("label").addClass("up-text");
        $(e.target).parent().children("input").removeClass("input-filled");
    }else{
        $(e.target).parent().children("input").addClass("input-filled");
    }
});
$(document).ready(()=>{    
    if(!bkTk || bkTk=='') bkTk = servicios.token(); 
    setTimeout(function(){login.validaSesion();},500); 
    $(document).keypress('keypress', (e)=>{
        if(e.which == 13){
            login.validaDatos();
        }
    })
    $('#loginBtn').on('click', ()=>{
        login.validaDatos();
    })  
    $('btn-rech').on('click', ()=>{
        admik.iniRecarga();
    })     
    $('.logout').on('click', ()=>{
        login.out();
    })
    $('.historial').on('click', ()=>{
        location.href='./historial.html';
    })
    $('.usuario').on('click', ()=>{
        location.href='./usuario.html';
    })
})   
var token = '', saldo = 0;
var appType = 'tBank';
var login = {
    showAlert: (title,msj,res) =>{
        if(!msj)msj='<br>';
        bootbox.alert({
            title: title,
            message: msj,
            centerVertical: true,
            callback: function() {
                if(res){location.href='usuario.html';}
            } 
        });
        
    },
    showAlertConfirm: (msj) =>{
        var bootboxHtml = $('#mk-planROk').html().replace('mk-rechOk', 'js-bootboxForm');
        bootbox.confirm({
            message: msj + '<br><br/>' + bootboxHtml,
            buttons: {
                confirm: {
                    label: ' Si ',
                    className: 'btn-success'
                },
                cancel: {
                    label: ' No ',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                //console.log('callback: ' + result);
                if(result){
                    let rNum = $('#num', '.js-bootboxForm').val();
                    let vPin = $('#pin', '.js-bootboxForm').val();
                    if(vPin.length<6)login.showAlert('verifica los datos','Pin: '+vPin+'<br>Numero: '+rNum);                    
                    else if(rNum.length<10)login.showAlert('verifica los datos','Pin: '+vPin+'<br>Numero: '+rNum);                    
                    else if(vPin != pin){
                        window.localStorage.removeItem("pin"); 
                        login.showAlert('PIN inválido','PIN ingresado: '+vPin);                                 
                        setTimeout( function(){
                            _C('bootbox-accept')[0].style.display='none';
                            _C('bootbox-accept')[0].style.pointerEvents='none';
                            _C('bootbox-close-button')[0].style.pointerEvents='none';
                        },500);                        
                        setTimeout('location.href="recarga.html"',2500);
                        
                    }else if(vPin == pin){                        
                        login.showAlert('REALIZANDO TRANSACCIÓN','Espere por favor');                               
                        setTimeout( function(){
                            _C('bootbox-accept')[0].style.display='none';
                            _C('bootbox-accept')[0].style.pointerEvents='none';
                            _C('bootbox-close-button')[0].style.pointerEvents='none';
                        },500);    
                        admik.realizaRecarga(rNum);                    
                    }
                    console.log(vPin);  
                }                    
            }
        });
    },
    out: ()=>{        
        localStorage.clear();
        location.href='../index.html';
    },
    validaDatos: ()=>{
        var user = $('#usuario').val();
        user = user.toLowerCase();
        var pw = $('#password').val();  
        servicios.sesion(user,pw);  
    },
    validaSesion: ()=>{        
        token = window.localStorage.getItem("token"); 
        saldo = window.localStorage.getItem("saldo");   
        if(token)console.log(token)
        else{            
            user = window.localStorage.getItem("user"); 
            pw = window.localStorage.getItem("pw");
            if(user!='undefined' && pw!='undefined') login.actualizaToken(user,pw);
            else login.out();
        }         
        if(_I('title-top')&&saldo) _I('title-top').innerHTML='<small>Saldo Disponible:</small><br/>'+saldo;   
    },
    actualizaToken: (user,pw)=>{     
        if(user==undefined || pw==undefined || !user || !pw) login.out(); 
        else servicios.sesion(user,pw);  
    }
}
var datos ={    
    User: () => {   
        data=JSON.parse(window.localStorage.getItem("uslg"));     
        if(data.existe){
            var html = '';
            $.each(data, function(j,p){
                if(j=='cuenta')html += '<p class="dUs">Número dew Cuenta: <b>'+p+'</b><br></p>';
                if(j=='nombre')html += '<p class="dUs">Nombre(s): <b>'+p+'</b><br></p>';
                if(j=='aPaterno')html += '<p class="dUs">Apellido Paterno: <b>'+p+'</b><br></p>';
                if(j=='aMaterno')html += '<p class="dUs">Apellido Materno: <b>'+p+'</b><br></p>';
                if(j=='email')html += '<p class="dUs">M@il: <b>'+p+'</b><br></p>';
                if(j=='telefono')html += '<p class="dUs">Telefono: <b>'+p+'</b><br></p>';
            })
            console.log(html);
            _I('usName').innerHTML='Hola '+data.nombre;
            _I('mk-usuario').innerHTML=html;
        }else{
            login.showAlert(data.message,'No se pudo obtener sus datos');
        }
    },
    movimientos : () =>{   
        var id=window.localStorage.getItem("id");
        var movs = new Object()
        movs.id=id;
        movs.type="movimientos";
        peticion=servicios.peticionTkArr(movs);
        peticion.done(function( data ) {
            var html = '';
            if(data.result == 'error'){login.actualizaToken();}
            else{     
                tMovs = data.response;
                if(tMovs.length>0){
                    $.each(tMovs, function(j,p){
                        if(j==''){}
                        num = ''
                        if(p.monto)num='Monto: <big>'+p.monto+'</big><br>'
                        html += '<div class="mk-nMov hv-'+j+'" id="'+p.cuenta+'">'+num+'<span><br>'+
                                'Fecha: '+p.date+' | '+p.hora+'</span></div>';      
                    })                      
                } 
                console.log(tMovs);
            }
            _I('mk-mov').innerHTML=html;
            console.log(data);
        });
    }
}
var servicios ={
    token: ()=>{        
        var dato = new Object()
        dato.a="YWRtaW5Aam9yeGVsLmNvbQ==";
        dato.b="B@nkT3stj0rX#L.";
        dato.type='genToken';
        peticion=servicios.peticionArr(dato);
        peticion.done(function( data ) {
            jwdTk = data.token;
            window.localStorage.setItem("token",jwdTk); 
            return jwdTk;
        });
    },
    sesion: (user,pw)=>{
        var token = bkTk; 
        var dato = new Object()
        dato.usuario=user;
        dato.password=pw;
        dato.type='validarsesion';
        peticion=servicios.peticionTkArr(dato);
        peticion.done(function( data ) {
            if(data.responseCode=='400'){
                bkTk = servicios.token(); token = bkTk;
            }else if (data.existe){                
                window.localStorage.setItem("uslg",JSON.stringify(data));
                window.localStorage.setItem("saldo",data.saldo);  
                window.localStorage.setItem("id",data.cuenta);  
                if(_I('remember')){
                    if(_I('remember').checked === true){
                        window.localStorage.setItem("Nombre",user);
                        window.localStorage.setItem("password",pw);
                    }
                }
                if(_I('title-top')) _I('title-top').innerHTML='hola '+data.nombre;                
                location.href='view/usuario.html';
            }    
            else    login.showAlert('','Usuario o contraseña Inválida');
        });        
    },
    peticionArr:(arr)=>{
        let A = JSON.stringify(arr);
        return $.ajax({
            url: url, method:"POST", contentType:'application/json', mimeType:'application/json', dataType:'json', data: A,
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            login.showAlert('Espere por favor.','Realizando conexión con el servidor');
        });
    },
    peticionTkArr:(arr)=>{
        if(token){
            var A = '';
            if(arr){A = JSON.stringify(arr);}
            return $.ajax({
                url: url, method:"POST", headers: {'Authorization': 'Bearer '+token}, mimeType:'application/json', dataType:'json',data: A
            }).fail( function( jqXHR, textStatus, errorThrown ) {
                login.showAlert('Espere por favor.','Realizando conexión con el servidor.<br>Favor de verificar su conexión de internet.<br>Si el problema persiste contacte al proveedor.',true);
            });
        }
    }
} 

function _C(elemento){ return document.getElementsByClassName(elemento); }
function valor_(elemento){  return _C(elemento)[0].value; }
function _I(elemento){ return document.getElementById(elemento); }
function ocultar(elemento){ _I(elemento).style.display = "none"; }
function mostrar(elemento){ _I(elemento).style.display = "block"; }