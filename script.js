const form = document.querySelector('form');
const formSuccess = document.querySelector('#formSuccess');

const validators = {
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    usuario: value => value.trim().length >= 3,
    direccion: value => value.trim().length >= 5,
    password: value => value.trim().length >= 6
};

const errorMessages = {
    email: 'Ingrese un correo con formato válido.',
    usuario: 'El nombre de usuario debe tener al menos 3 caracteres.',
    direccion: 'Ingrese una dirección válida (mínimo 5 caracteres).',
    password: 'La contraseña debe tener al menos 6 caracteres.'
};

const showErrors = (container, errors) => {
    container.querySelectorAll('.form-error').forEach(span => {
        const field = span.dataset.errorFor;
        span.textContent = errors[field] || '';
    });
};

const buildCsv = data => {
    const headers = ['Correo', 'Nombre de Usuario', 'Dirección', 'Contraseña'];
    const row = [data.email, data.usuario, data.direccion, data.password];
    const escapeCsv = value => `"${String(value).replace(/"/g, '""')}"`;
    return `${headers.map(escapeCsv).join(',')}\n${row.map(escapeCsv).join(',')}`;
};

const downloadCsv = csvText => {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'registro-formulario.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

form?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = {
        email: document.getElementById('iCorreo').value,
        usuario: document.getElementById('nombredeusuario').value,
        direccion: document.getElementById('iDirecion').value,
        password: document.getElementById('iContraseña').value
    };

    const errors = {};
    
    Object.keys(formData).forEach(key => {
        if (!validators[key](formData[key])) {
            errors[key] = errorMessages[key];
        }
    });

    if (Object.keys(errors).length > 0) {
        if (formSuccess) formSuccess.textContent = '';
        showErrors(form, errors);
        return;
    }
    showErrors(form, {});

    const csvContent = buildCsv(formData);
    downloadCsv(csvContent);
    form.reset();
    
    if (formSuccess) {
        formSuccess.textContent = 'Registro guardado correctamente.';
    }
    alert('Formulario enviado.');
});