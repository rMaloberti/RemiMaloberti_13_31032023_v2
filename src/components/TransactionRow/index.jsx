import { useEffect, useState } from 'react';
import './index.css';
import { formatMonth } from '../../utils/helpers';
import icnEye from '../../assets/icn_eye.png';
import { useNavigate } from 'react-router';

const TransactionRow = ({ transactionData, userBalance }) => {
  const { _id, amount, description, date } = transactionData;

  const navigate = useNavigate();

  const [formatedDate, setFormatedDate] = useState(null);

  useEffect(() => {
    const dateToFormat = new Date(date);

    setFormatedDate(
      `${formatMonth(
        dateToFormat.getUTCMonth()
      )} ${dateToFormat.getUTCDate()}th, ${dateToFormat.getUTCFullYear()}`
    );
  }, [date]);

  const navigateToDetails = () => {
    navigate(`/transactions/${_id}`);
  };

  return (
    <tr className="transactions__table__row" onClick={navigateToDetails}>
      <td className="transactions__table__row__cell">
        <div className="transactions__table__row__cell__icon">
          <img className="transactions__table__row__cell__icon__img" alt="Eye icon" src={icnEye} />
        </div>
      </td>
      <td className="transactions__table__row__cell">{formatedDate}</td>
      <td className="transactions__table__row__cell">{description}</td>
      <td className="transactions__table__row__cell">${amount}</td>
      <td className="transactions__table__row__cell">${userBalance}</td>
    </tr>
  );
};

export default TransactionRow;
