import colors from 'colors';
import { confirmar, inquirerMenu, leerInput, listadoTareasBorrar, mostrarListadoChecklist, pausa } from './helpers/inquirer.js';
import { Tareas } from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

console.clear();

const main = async() => {
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        opt = await  inquirerMenu();
        console.log( {opt});

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                break;
            case '3':
                tareas.listadoPendientesCompletadas(true);
                break;
            case '4': 
                tareas.listadoPendientesCompletadas(false);
                break;
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if(id != '0'){
                    const ok = await confirmar('¿Está seguro?');
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log("Tarea borrada");
                    }
                }
                break;               
        }

        guardarDB( tareas.listadoArr);

        await pausa();

    } while (opt != '0');

   
}


main();