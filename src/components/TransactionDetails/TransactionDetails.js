import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainNavbar from '../MainNavbar/MainNavbar';
import { Card, Box } from "@mui/material";
import { GridComponent, ColumnsDirective, ColumnDirective,Sort,Inject } from "@syncfusion/ej2-react-grids";
import { db } from "../../database-config";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    query,
    where,
    Timestamp
} from "@firebase/firestore";
import './TransactionDetails.css'

const TransactionDetails = () => {
    const [userData, setUserData] = useState({});
    const [transaction, setTransaction] = useState([]);
    const location = useLocation();
    console.log('Location state', location);
    const userId = location?.state?.userID;
    

    useEffect(() => {         
        getDocument();
    }, []);


     const getDocument = async() =>{
        const userCollectionRef = await doc(db, 'vijay_user',userId);
        const docSnap = await getDoc(userCollectionRef);
        setUserData({ ...docSnap.data(), id: docSnap.id });

        const q = query(collection(db, "vijay_transaction"), where("user_id", "==", userId));

        const querySnapshot = await getDocs(q);
        let validIndex = 0;
        const transactions = querySnapshot.docs.map((doc) => {
            const currentIndex = validIndex++;
            return {
                'S/r': currentIndex + 1,
                'Remark': doc.data().remark,
                'Date': new Timestamp(doc.data().date.seconds, doc.data().date.nanoseconds).toDate(),
                'Debited': doc.data().transaction_type === 'DEBITE/नावे' ? doc.data().amount : '',
                'Credited': doc.data().transaction_type === 'CREDITE/जमा' ? doc.data().amount : '',
                id: doc.id
            };
        });

        // Calculate total debited and credited
        const totalDebited = transactions.reduce((acc, curr) => acc + parseFloat(curr.Debited || 0), 0);
        const totalCredited = transactions.reduce((acc, curr) => acc + parseFloat(curr.Credited || 0), 0);

        // Add total row
        const totalRow = {
            'S/r': '',
            'Remark': 'Total',
            'Date': '',
            'Debited': totalDebited,
            'Credited': totalCredited
        };

        // Set transactions including total row
        setTransaction([...transactions, totalRow]);

    }    

    const debitedTemplate = (props) => {
        return <div style={{ color: props.Debited > 0 ? 'red' : 'inherit' }}>{props.Debited}</div>;
    };

    const creditedTemplate = (props) => {
        return <div style={{ color: props.Credited > 0 ? 'green' : 'inherit' }}>{props.Credited}</div>;
    };

    const queryCellInfoHandler = (args) => {
        console.log('in query',args);
        if (args.data['S/r'] === '') {
            args.cell.classList.add('make-bold');
        }
    };

    return (
        <div>
            <MainNavbar/>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                <Card sx={{ width: 350, margin: 2, padding: 2, textAlign: 'left', boxShadow: 4, bgcolor: 'grey.200' }}>
                    <div>
                        <b>नाव</b> : {`${userData.last_name} ${userData.first_name} ${userData.middle_name ? userData.middle_name + ' ' : ''}`}
                    </div>
                    <div>
                        <b>पत्ता</b> : {userData.address}
                    </div>                   
                </Card>
                <Card sx={{ width: 350, margin: 2, padding: 2, textAlign: 'left', boxShadow: 4, bgcolor: 'grey.200' }}>
                    <div>
                        <b>मोबाइल</b> : {userData.mobile}
                    </div>
                    <div>
                        <b>ईमेल</b> : {userData.email}
                    </div> 
                </Card>
                <Card sx={{ width: 350, margin: 2, padding: 2, textAlign: 'left', boxShadow: 4, bgcolor: 'grey.200'}}>
                    <div>
                        <b>Closing Balance</b> :    <span style={{ color: userData.closing_balance < 0 ? 'red' : 'green' }}>{userData.closing_balance}</span>
                    </div>
                </Card>
            </Box>
            <GridComponent dataSource={transaction}
            allowSorting={true}
            queryCellInfo={queryCellInfoHandler}
            cssClass="custom-grid">

            <ColumnsDirective>
                    <ColumnDirective field='S/r' headerText='क्रमांक' width='150' textAlign='Center'/>
                    <ColumnDirective field='Remark' headerText='तपशील' width='200' />
                    <ColumnDirective field='Date' headerText='दिनांक' width='150' format='dd/MM/yyyy' type="date"/>
                    <ColumnDirective field='Debited' headerText='नावे' width='150' template={debitedTemplate}/>
                    <ColumnDirective field='Credited' headerText='जमा' width='120' format='0.00' template={creditedTemplate}/>
                </ColumnsDirective>

                <Inject services={[Sort]}></Inject>
            </GridComponent>
        </div>
    );
};

export default TransactionDetails;
