import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MainNavbar from '../MainNavbar/MainNavbar';
import { Card, Box } from "@mui/material";
import { GridComponent, ColumnsDirective, ColumnDirective,Sort,Inject,Edit,CommandColumn,Toolbar } from "@syncfusion/ej2-react-grids";
import { db } from "../../database-config";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    query,
    where,
    Timestamp,
    updateDoc,
    deleteDoc,
} from "@firebase/firestore";
import './TransactionDetails.css'

const TransactionDetails = () => {
    const [userData, setUserData] = useState({});
    const [transaction, setTransaction] = useState([]);
    const location = useLocation();
    // console.log('Location state', location);
    const userId = location?.state?.userID;
    var allowCreditEdit = false;
    var allowDebitEdit = false;
    

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
                id: doc.id,
                amount : doc.data().amount
            };
        });

        const totalDebited = transactions.reduce((acc, curr) => acc + parseFloat(curr.Debited || 0), 0);
        const totalCredited = transactions.reduce((acc, curr) => acc + parseFloat(curr.Credited || 0), 0);

        const totalRow = {
            'S/r': '',
            'Remark': 'Total',
            'Date': '',
            'Debited': totalDebited,
            'Credited': totalCredited
        };

        setTransaction([...transactions, totalRow]);

    }    

    const debitedTemplate = (props) => {
        allowDebitEdit = props.Debited > 0 ? true : false;
        // console.log( 'props.Debited allowDebitEdit=  ',allowDebitEdit);
        // console.log( 'props.Debited value=  ',props.Debited);
        return <div style={{ color: props.Debited > 0 ? 'red' : 'inherit' }}>{props.Debited}</div>;
    };

    const creditedTemplate = (props) => {
        allowCreditEdit = props.Credited > 0 ? true : false;
        // console.log( 'props.Credit allowDebitEdit=  ',allowCreditEdit);
        // console.log( 'props.credit value=  ',props.Credited);
        return <div style={{ color: props.Credited > 0 ? 'green' : 'inherit' }}>{props.Credited}</div>;
    };

    const queryCellInfoHandler = (args) => {
        // console.log('in query',args);
        if (args.data['S/r'] === '') {
            args.cell.classList.add('make-bold');
        }
    };

    const handleActionComplete = async (args) => {
        // console.log('In update outside', args);
        if (args.requestType === 'save') {
            // console.log('In update inside');
            await updateDocumentInFirebase(args.data);
        }
    };
    
    const handleActionBegin = async (args) => {
        // console.log('In delete outside',args);
        if (args.requestType === 'delete') {
            // console.log('In delete inside');
            await deleteDocumentFromFirebase(args.data[0].id);
        }
    };
    
    const updateDocumentInFirebase = async (updatedData) => {
        const docRef = doc(db, "vijay_transaction", updatedData.id);
        let data = {
            amount : updatedData.Credited > 0 ? updatedData.Credited: updatedData.Debited,
            date :updatedData.Date ,
            remark :  updatedData.Remark           
        };
        await updateDoc(docRef, data);
    };
    
    const deleteDocumentFromFirebase = async (documentId) => {
        await deleteDoc(doc(db, "vijay_transaction", documentId));
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
            id='Grid'
            allowSorting={true}
            toolbar={['Add', 'Edit', 'Delete', 'Update', 'Cancel']}
            editSettings = { {allowEditing: true, allowAdding: true, allowDeleting: true }}
            queryCellInfo={queryCellInfoHandler}
            cssClass="custom-grid"
            actionComplete={handleActionComplete}
            actionBegin={handleActionBegin}>

            <ColumnsDirective>
                    <ColumnDirective field='S/r' headerText='क्रमांक' width='150' textAlign='Center' isPrimaryKey ={true} />
                    <ColumnDirective field='Remark' headerText='तपशील' width='200' />
                    <ColumnDirective field='Date' headerText='दिनांक' width='150' format='dd/MM/yyyy' type="date"/>
                    <ColumnDirective field='Debited' headerText='नावे' width='150' template={debitedTemplate} allowEditing={allowDebitEdit}/>
                    <ColumnDirective field='Credited' headerText='जमा' width='120' format='0.00' template={creditedTemplate} allowEditing={allowCreditEdit}/>
                </ColumnsDirective>

                <Inject services={[Sort, Edit, CommandColumn, Toolbar]}></Inject>
            </GridComponent>
        </div>
    );
};

export default TransactionDetails;
