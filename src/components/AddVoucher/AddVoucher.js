import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { db } from "../../database-config";
import Select from "react-select";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "@firebase/firestore";

function AddVoucher(props) {
  const [voucherForm, setVoucherForm] = useState({
      amount: 0,
      date: new Date(),
      remark: "",
      transaction_type: {
        label: "CREDITE/जमा",
        value: "CREDITE/जमा",
      },
      user_id: "",
    }),
    [usersList, setUsersList] = useState([]);

  // collection reference for getting users list 
  const UsersCollectionRef = collection(db, "vijay_user");

  // select transaction type
  const selectOptions = [
    {
      label: "CREDITE/जमा",
      value: "CREDITE/जमा",
    },
    {
      label: "DEBITE/नावे",
      value: "DEBITE/नावे",
    },
  ];

  const getAllUsersData = async () => {
    // base array
    const usersArray = [];
    await getDocs(UsersCollectionRef).then((d) => {
      d.docs.map((s) => {
        console.log("single", s);
        console.log("single data", s.data());
        // adding in base array
        usersArray.push({ ...s.data(), id: s.id });
      });
    });
    console.log("all users", usersArray);
    // setting users list
    setUsersList(usersArray);
    // setting base option for users list
    onChangeInput(
      "user_id",
      usersArray[0] && {
        label: `${usersArray[0].first_name} ${usersArray[0].middle_name} ${usersArray[0].last_name}`,
        value: `${usersArray[0].user_id}`,
      }
    );
  };

  useEffect(() => {
    // fetch the users list on mount
    getAllUsersData();
  }, []);

  const onChangeInput = (key, value) => {
    setVoucherForm((prevState) => ({ ...prevState, [key]: value }));
  };

  const onSubmit = async () => {
    // refine selects and make proper datas
    const dataToPut = {
      ...voucherForm,
      transaction_type: voucherForm.transaction_type?.value,
      user_id: voucherForm.user_id?.value,
    };
    window.alert(JSON.stringify(dataToPut));
    // create the record
    const docRef = await addDoc(
      collection(db, "vijay_transaction"),
      dataToPut
    );
    // update the record with unique id
    await updateDoc(docRef, { transaction_id: docRef.id });
    // user doc from userslist
    let userData = usersList.filter(
      (user) => user.user_id == dataToPut.user_id
    )[0];
    // current amount in db
    let baseAmount = Number(userData?.closing_balance);
    // check transaction type
    if (dataToPut.transaction_type == "CREDITE/जमा") {
      // if it is credit
      console.log("it is credit");
      baseAmount += Number(dataToPut.amount);
    } else {
      // if it is debit
      console.log("it is debit");
      baseAmount -= Number(dataToPut.amount);
    }
    console.log("baseamount", baseAmount);
    // get the doc for selected user from db
    const userDoc = doc(db, "vijay_user", userData?.id);
    // update user balance
    await updateDoc(userDoc, { closing_balance: baseAmount.toString() });
    console.log("updated doc", userDoc);
  };

  return (
    <div className="container-wrapper">
      <div className="login-container">
        <table>
          <tr>
            <td colSpan={2}>
              <div className="center-align">
                <h2>Add Voucher</h2>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <label for="typeFormControl" className="label mr-8 margin-top-8">
                Transaction type
              </label>
            </td>
            <td>
              <Select
                defaultValue={voucherForm.transaction_type}
                value={voucherForm.transaction_type}
                onChange={(selectedOption) =>
                  onChangeInput("transaction_type", selectedOption)
                }
                options={selectOptions}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="typeFormControl" className="label mr-8 margin-top-4">
                User
              </label>
            </td>
            <td>
              <Select
              className="margin-top-4"
                defaultValue={voucherForm.user_id}
                value={voucherForm.user_id}
                onChange={(selectedOption) =>
                  onChangeInput("user_id", selectedOption)
                }
                options={usersList.map((opt) => ({
                  label: `${opt.first_name} ${opt.middle_name} ${opt.last_name}`,
                  value: `${opt.user_id}`,
                }))}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label
                for="courseFormControl"
                className="label mr-8 margin-top-4"
              >
                Amount
              </label>
            </td>
            <td>
              <input
                type="number"
                class="form-control margin-top-4"
                onChange={(event) =>
                  onChangeInput("amount", event.target.value)
                }
                value={voucherForm.amount}
                id="courseFormControl"
                placeholder="Amount"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label for="exampleFormControlInput1" className="label mr-8 margin-top-4">
                Remark
              </label>
            </td>
            <td>
              <input
                type="text"
                className="form-control margin-top-4"
                onChange={(event) =>
                  onChangeInput("remark", event.target.value)
                }
                value={voucherForm.remark}
                id="exampleFormControlInput1"
                placeholder="Remark"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label
                for="startDateNameFormControl"
                className="label mr-8 margin-top-4"
              >
                Date
              </label>
            </td>
            <td>
              <DatePicker
                className="margin-top-4 dpicker-border"
                wrapperClassName="dpicker-wrapper"
                selected={voucherForm.date}
                // showTimeSelect={true}
                dateFormat={"dd/MM/YYYY"}
                onChange={(date) => onChangeInput("date", date)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div class="center-align">
                <button
                  type="button"
                  class="btn btn-primary margin-top-8"
                  onClick={onSubmit}
                >
                  Add Voucher
                </button>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default AddVoucher;
