import React, { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Toolbar, Inject, PdfExport, ExcelExport } from "@syncfusion/ej2-react-grids";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import './Transaction.css';
import { db } from "../../database-config";
import {
    collection,
    getDocs,
    Timestamp
} from "@firebase/firestore";
import { useNavigate } from "react-router-dom";


const Transaction = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getAllTransactionsData();
    }, []);
    

    const getAllTransactionsData = async () => {
        const userCollectionRef = collection(db, 'vijay_user');

        const userSnapshot = await getDocs(userCollectionRef);

        const userMap = {};
        userSnapshot.forEach(userDoc => {
            userMap[userDoc.id] = userDoc.data();
        });
        let validIndex = 0;
        const data = userSnapshot.docs.map((doc, index) => {
            const transaction = doc.data();
            const user = userMap[transaction.user_id];
            

            if (!user || user.closing_balance === null || user.closing_balance === 0) {
                return null;
              }

            if(user.validToExport){
                const fullName = `${user.last_name} ${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}`;
            const currentIndex = validIndex++;
            return {
                'S/R No': currentIndex + 1,
                'Name': fullName,
                'Mobile': user.mobile,
                'Date': new Timestamp(user.updated_date.seconds, user.updated_date.nanoseconds).toDate(),
                'Amount': Math.abs(user.closing_balance),
                'TransactionType': user.closing_balance > 0 ? "CREDITE" : "DEBITE",
                'user_id': user.user_id,
                'Address' : user.address,
                'email' : user.email,
            };
            }  else{
                return null;
            }       
            
        }).filter(record => record !== null);

        setTransactionData(data);
    }

    const handleClick = (values) => {
        console.log('in props.user_id', values.user_id);
        console.log('Row data:', values);
        setSelectedTransaction(values.user_id);
        navigate("/transaction-records", {state: {userID:values.user_id}} );
    };

    const actionTemplate = (props) => {       

        return (
            <div style={{ textAlign: 'left' }}>
                <IconButton aria-label="visibility" onClick={() => handleClick(props)}>
                    <VisibilityIcon />
                </IconButton>
            </div>
        );
      };
      let grid ;
    const toolbarClick = (args) =>{
        if (grid && args.item.id === 'Grid_pdfexport') {
            grid.pdfExport();
          }
        if (grid && args.item.id === 'Grid_refresh') {
            getAllTransactionsData(); 
            console.log('In Refresh');
        }
        if (grid && args.item.id === 'Grid_excelexport') {
            const selectedRecords = grid.getSelectedRecords();
            const exportProperties = {
                dataSource: selectedRecords
            };
            console.log('In Excel', exportProperties);
            grid.excelExport(exportProperties);
        }
         
    }

    const selectionOptions = { type: 'Multiple', enableSimpleMultiRowSelection: true };
    
    return (
        <div >
            <GridComponent dataSource={transactionData}
                id='Grid'
                ref = {g => grid = g}
                allowFiltering={true}
                selectionSettings={selectionOptions}
                filterSettings={{ ignoreAccent: true, type: 'Excel' }}
                allowSorting={true}
                allowPaging={true}
                pageSettings={{ pageSize: 15 }}
                allowPdfExport = {true}
                toolbar={['PdfExport', 'Refresh','ExcelExport']}
                toolbarClick = {toolbarClick}
                >
                <ColumnsDirective>
                    <ColumnDirective field='S/R No' headerText='क्रमांक' width='150' textAlign='Center'/>
                    <ColumnDirective field='Name' headerText='नाव' width='200' />
                    <ColumnDirective field='Mobile' headerText='मोबाइल' width='150' />
                    <ColumnDirective field='Date' headerText='दिनांक' width='150' format='dd/MM/yyyy' type="date" />
                    <ColumnDirective field='Amount' headerText='रक्कम' width='120' textAlign='Center' format='0.00'/>
                    <ColumnDirective field='TransactionType' headerText='व्यवहाराचा प्रकार' width='180' />
                    <ColumnDirective headerText='' width='50' template={(props) => actionTemplate(props)} />
                </ColumnsDirective>
                <Inject services={[Filter,Sort,Page,Toolbar,PdfExport,ExcelExport]}></Inject>

            </GridComponent>   
        </div>
    );
};

export default Transaction;
