import './elements/check-box';
import './elements/radio-button';
import './elements/form-group';
import './elements/radio-group';

async function bootstrap () {

    console.log('loaded..');

    const form = document.getElementById('survey') as HTMLFormElement;
    const submit = document.getElementById('submit') as HTMLButtonElement;

    submit!.addEventListener('click', () => {

        const formJSON = [...new FormData(form).entries()].reduce((json, [name, value]) => {

            if (json.hasOwnProperty(name)) {

                if (!(json[name] instanceof Array)) {

                    json[name] = [json[name]];
                }

                json[name].push(value);

            } else {

                json[name] = value;
            }

            return json;

        }, {} as { [key: string]: any });

        console.log(formJSON);
    });
}

window.addEventListener('DOMContentLoaded', () => {

    bootstrap();
});
