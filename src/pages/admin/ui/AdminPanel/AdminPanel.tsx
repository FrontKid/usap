import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { DocumentData } from 'firebase/firestore';
import {
  CircularProgressProps,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Button } from '@/shared/ui';
import { ETabRoutes } from '@/entities/sidebar';

import css from './AdminPanel.module.scss';
import {
  deleteUserDataAndAuth,
  getAllUsersInfo,
  updateUserAdminStatus,
} from '@/shared/firebase/services';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#111827',
    color: theme.palette.common.white,
    fontWeight: 700,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1rem',
    fontWeight: 500,
    verticalAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const label = { inputProps: { 'aria-label': 'switch' } };

const getTransformForUserAdminPanel = (users: DocumentData[]) => {
  const usersClone = [...users];

  return usersClone.map(user => {
    const testsCompletedInfo = Object.values(user?.testsCompletedInfo);
    const totalQuizes = testsCompletedInfo.length;
    const completedQuizes = testsCompletedInfo.filter(
      el => (el as number) >= 100,
    ).length;
    const total = Math.round((completedQuizes / totalQuizes) * 100);

    return {
      id: user?.id ?? '',
      email: user?.email ?? '',
      isAdmin: user?.isAdmin ?? false,
      testsCompleted: total,
    };
  });
};

function LinearProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <>
      {props.value < 100 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" {...props} />
          </Box>
          <Box sx={{ minWidth: '2.3rem' }}>
            <Typography
              sx={{ width: 'fit-content' }}
              variant="body2"
              color="text.secondary"
            >
              {`${Math.round(props.value)}%`}
            </Typography>
          </Box>
        </Box>
      ) : (
        <FaCheckCircle size="2rem" color="#44b66f" />
      )}
    </>
  );
}

const AdminPanel = () => {
  const [users, setUsers] = useState<DocumentData[]>([]);
  const usersTransformed = getTransformForUserAdminPanel(users);
  const [userData] = useLocalStorage<TUser>('user');

  const handleSwitchAdminAccess = async (id: string, isAdmin: boolean) => {
    try {
      await updateUserAdminStatus(id, !isAdmin);

      setUsers(prevUsers =>
        // prettier-ignore
        prevUsers.map(user =>
          (user.id === id ? { ...user, isAdmin: !isAdmin } : user)),
      );
    } catch (error) {
      // console.log(error)
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (userId !== userData?.user.id) {
        await deleteUserDataAndAuth(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      setUsers(await getAllUsersInfo());
    })();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell align="center">Progress</StyledTableCell>
            <StyledTableCell align="center">PDF Forms</StyledTableCell>
            <StyledTableCell align="center">Admin</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersTransformed.map(user => (
            <StyledTableRow key={user.id}>
              <StyledTableCell align="left" component="th" scope="row">
                {user.email}
              </StyledTableCell>
              <StyledTableCell align="center">
                <LinearProgressWithLabel value={user.testsCompleted} />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button
                  className={css.actionButton}
                  to={`${ETabRoutes.ADMIN_PANEL}/${user.email}`}
                  color="textButton"
                >
                  PDF
                </Button>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Switch
                  onClick={() => handleSwitchAdminAccess(user.id, user.isAdmin)}
                  {...label}
                  checked={user.isAdmin}
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Button
                  onClick={() => handleDeleteUser(user.id)}
                  isDisable={userData?.user.id === user.id}
                  color="textButton"
                >
                  Delete
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { AdminPanel };
