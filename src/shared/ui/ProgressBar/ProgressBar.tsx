import { FC } from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { Box, CircularProgress, Typography } from '@mui/material';
import css from './ProgressBar.module.scss';

type TProgressBarProps = {
  progress: number;
  title: string;
};

const ProgressBar: FC<TProgressBarProps> = ({ progress, title }) => {
  return (
    <div className={css.contentWrapper}>
      <Box className={css.box}>
        <CircularProgress
          variant="determinate"
          sx={{ position: 'absolute', zIndex: 1 }}
          thickness={4}
          value={progress}
        />
        <CircularProgress
          variant="determinate"
          className={css.greyCircle}
          value={100}
          thickness={4}
        />
        {progress === 100 ? (
          <FaCircleCheck className={css.check} style={{ fontSize: '2.7rem' }} />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <Typography variant="caption" className={css.percent}>
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        )}
      </Box>

      <span className={css.title}>{title}</span>
    </div>
  );
};

export { ProgressBar };
