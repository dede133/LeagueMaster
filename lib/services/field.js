export const addField = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/field/add-field', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al añadir el campo.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en el servidor:', error);
    throw new Error('Hubo un error al intentar añadir el campo.');
  }
};

export const getUserFields = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/field/user-fields',
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cargar los campos.');
    }

    return data.fields;
  } catch (error) {
    console.error('Error al cargar los campos:', error);
    throw new Error('Error al cargar los campos.');
  }
};

export const getFieldDetails = async (field_id) => {
  console.log('getFieldDetails');
  try {
    const response = await fetch(`http://localhost:5000/api/field/${field_id}`);
    if (!response.ok) {
      throw new Error('Error al cargar los detalles del campo');
    }
    const data = await response.json();
    return data.field;
  } catch (error) {
    console.error('Error al cargar los detalles del campo:', error.message);
    throw error;
  }
};

export const fetchFields = async () => {
  console.log('fetchFields');
  try {
    const response = await fetch('http://localhost:5000/api/field');
    if (!response.ok) {
      throw new Error('Error al cargar los campos');
    }
    const data = await response.json();
    return data.fields;
  } catch (error) {
    throw new Error(error.message);
  }
};
