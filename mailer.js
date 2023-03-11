import nodemailer from 'nodemailer';

export function sendOrderToAdmin({toMailId,order}){
    return new Promise((res,rej) => {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.AD_EMAIL,
                pass:process.env.AD_PASSWORD
            }
        })

        let ordersList =order.orderItems;
        let orderString = ordersList.map((ord,index) => {
            return ` ${index+1}. ${ord.name} - ${ord.size} - ${ord.crust} - ${ord.quantity} - ${ord.finalPrice} `;
        })

        //set from mail id, to mail id, subject and mail body
        const message={
            from:process.env.toMailId,
            to:toMailId,
            subject:"New Order Received",
            html:`<form method="POST">
            <h3>Alert!!!</h3>
            <p>New Order has been received</p>
            <p>Order Id - ${order.orderId}</p>
            <p>Date - ${order.date}</p>
            <p>Receipt - ${order.receipt}</p>
            <p>Payment Id - ${order.paymentId}</p>
            <p>Customer name - ${order.name}</p>
            <p><b>Orders</b></p>
            <p>${orderString}</p>
            </form>`
        }

        transporter.sendMail(message,function(err,info) {
            if(err){
                rej(err);
            }
            else{
                res(info);
            }
        })
    })
}

export function sendResetLink({toMailId,token,isAdmin}){

    return new Promise((res,rej) => {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.AD_EMAIL,
                pass:process.env.AD_PASSWORD
            }
        })
        let loginUser="customer";
        if(isAdmin){
            loginUser="admin";
        }
        //set from mail id, to mail id, subject and mail body
        const message={
            from:process.env.GOOGLE_USER,
            to:toMailId,
            subject:"Password Reset",
            html:`<form method="PUT">
            <h3>Hello,</h3>
            <p>Click on the below link to reset password</p>
            <p><a target="_blank" href=${process.env.DOMAIN}/resetPassword/${token}/${loginUser}>${process.env.DOMAIN}/resetPassword/${token}</a></p>
            <p>Regards,</p>
            <p>Application Team</p>
            </form>`
        }

        transporter.sendMail(message,function(err,info) {
            if(err){
                rej(err);
            }
            else{
                res(info);
            }
        })
    }) 
}