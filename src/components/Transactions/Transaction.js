import React, { useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Toolbar, Inject, PdfExport, toolbarClick } from "@syncfusion/ej2-react-grids";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import './Transaction.css';
import { db } from "../../database-config";
import {
    collection,
    getDocs,
    Timestamp
} from "@firebase/firestore";

const Transaction = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

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


            const fullName = `${user.last_name} ${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}`;
            const currentIndex = validIndex++;
            return {
                'S/R No': currentIndex + 1,
                'नाव': fullName,
                'मोबाइल': user.mobile,
                'तारीख': new Timestamp(user.updated_date.seconds, user.updated_date.nanoseconds).toDate(),
                'रक्कम': Math.abs(user.closing_balance),
                'व्यवहाराचा प्रकार': user.closing_balance > 0 ? "CREDITE/जमा" : "DEBITE/नावे",
            };            
            
        }).filter(record => record !== null);;

        setTransactionData(data);
    }

    const actionTemplate = (props) => {
        return (
            <div style={{ textAlign: 'left' }}>
            <IconButton aria-label="visibility">
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
    }


    return (
        <div style={{ margin: '10%', marginTop: '5%' }} >
            <GridComponent dataSource={transactionData}
                id='Grid'
                ref = {g => grid = g}
                allowFiltering={true}
                filterSettings={{ ignoreAccent: true, type: 'Excel' }}
                allowSorting={true}
                allowPaging={true}
                pageSettings={{ pageSize: 15 }}
                allowPdfExport = {true}
                toolbar = {['PdfExport']}
                toolbarClick = {toolbarClick}
                >
                <ColumnsDirective>
                    <ColumnDirective field='S/R No' headerText='क्रमांक' width='150' textAlign='Center'/>
                    <ColumnDirective field='नाव' headerText='नाव' width='200' />
                    <ColumnDirective field='मोबाइल' headerText='मोबाइल' width='150' />
                    <ColumnDirective field='तारीख' headerText='तारीख' width='150' format='dd/MM/yyyy' type="date" />
                    <ColumnDirective field='रक्कम' headerText='रक्कम' width='120' textAlign='Center' format='0.00'/>
                    <ColumnDirective field='व्यवहाराचा प्रकार' headerText='व्यवहाराचा प्रकार' width='180' />
                    <ColumnDirective headerText='' width='50' template={actionTemplate} />
                </ColumnsDirective>
                <Inject services={[Filter,Sort,Page,Toolbar,PdfExport]}></Inject>
            </GridComponent>    
        </div>
    );
};

export default Transaction;
