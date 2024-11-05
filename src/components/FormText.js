import Form from 'react-bootstrap/Form';

function FormText({title, titleid}) {
  return (
    <>
      <Form.Label htmlFor={titleid}>{title}</Form.Label>
      <Form.Control
        type="text"
        id={titleid}
      />
    </>
  );
}

export default FormText;