/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Avatar, CardContent, Typography } from '@mui/material';
import { Button } from '@/shared/ui';
import {
  formsDto,
  IPDFField,
  useG1145Fields,
  useI130aFields,
  useI130Fields,
  useI131Fields,
  useI485Fields,
  useI765Fields,
  useI864Fields,
} from '@/entities/forms';

import css from './Forms.module.scss';
import { ff } from '@/shared/fileforge';

const Forms = () => {
  const formFields: { [key: string]: IPDFField[] } = {
    'i-130': useI130Fields(),
    'i-130a': useI130aFields(),
    'i-131': useI131Fields(),
    'i-485': useI485Fields(),
    'i-765': useI765Fields(),
    'i-864': useI864Fields(),
    'g-1145': useG1145Fields(),
  };

  const handleVisaPDfForm = async (title: string) => {
    try {
      const response = await fetch(`/project/src/shared/pdf/${title}.pdf`);

      const blobPDF = await response.blob();

      const file = new File([blobPDF], `${title}.pdf`, {
        type: 'application/pdf',
      });

      const formFillRequest: any = {
        options: {
          flattenForm: false,
          fields: formFields[title],
        },
      };

      const requestOptions = {
        timeoutInSeconds: 60,
        maxRetries: 1,
      };

      const filledPdfStream = await ff.pdf.form.fill(
        file,
        formFillRequest,
        requestOptions,
      );

      const blobStream = await new Response(filledPdfStream as any).blob();
      const url = URL.createObjectURL(blobStream);
      const a = document.createElement('a');

      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // eslint-disable-next-line no-console
      console.log(
        'PDF form filling successful. Stream ready.',
        filledPdfStream,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during PDF form filling:', error);
    }
  };

  return (
    <>
      <div className={css.formContainer}>
        {formsDto.map(({ title, Icon }) => (
          <Button
            key={title}
            onClick={() => handleVisaPDfForm(title.toLowerCase())}
            color="textButton"
          >
            <Card
              sx={{
                cursor: 'pointer',
                maxWidth: '40rem',
                borderRadius: '1rem',
                textAlign: 'center',
                boxShadow: 3,
                padding: '2rem',
                flex: 1,
                position: 'relative',
              }}
            >
              <Avatar
                sx={{
                  width: '4rem',
                  height: '4rem',
                  margin: 'auto auto 2rem',
                  bgcolor: '#111827',
                }}
              >
                <Icon size="2rem" />
              </Avatar>
              <CardContent>
                <Typography
                  className={css.title}
                  sx={{
                    position: 'absolute',
                    bottom: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                  variant="h6"
                >
                  {title}
                </Typography>
              </CardContent>
            </Card>
          </Button>
        ))}
      </div>
    </>
  );
};

export { Forms };
