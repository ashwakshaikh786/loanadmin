import { 
    Grid, 
    
  } from '@mui/material'; 
  import TopCards from 'components/sections/telecaller/top-cards';
  import AvatarCard from 'components/sections/telecaller/avatar-card';
  import TotalSpent from 'components/sections/telecaller/total-spent';
  import Balance from 'components/sections/telecaller/balance';
  import SpentThisMonth from 'components/sections/telecaller/spent-this-month';
  import Transactions from 'components/sections/telecaller/transactions';
  import Tasks from 'components/sections/telecaller/tasks';
  import Earnings from 'components/sections/telecaller/earnings';
  import CreditBalance from 'components/sections/telecaller/credit-balance';
  import TransactionHistory from 'components/sections/telecaller/transaction-history';
const Dashbaord = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12}>
      <TopCards />
      </Grid>

      <Grid item xs={12} md={8}>
        <TotalSpent />
      </Grid>

      <Grid item xs={12} md={4}>
        <AvatarCard />
      </Grid>

      <Grid item xs={12} md={8}>
        <Balance />
      </Grid>

      <Grid item xs={12} md={4}>
        <SpentThisMonth />
      </Grid>

      <Grid item xs={12} md={4}>
        <Transactions />
      </Grid>

      <Grid item xs={12} md={4}>
        <Tasks />
      </Grid>

      <Grid item xs={12} md={4}>
        <Earnings />
      </Grid>

      <Grid item xs={12} md={4}>
        <CreditBalance />
      </Grid>

      <Grid item xs={12} md={8}>
        <TransactionHistory />
      </Grid>
    </Grid>
  );
};

export default Dashbaord;
