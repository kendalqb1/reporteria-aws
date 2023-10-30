import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { BsArrowRepeat } from 'react-icons/bs';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import { BiMessageAltDetail } from 'react-icons/bi' // Iconos
import './App.css'
import Swal from 'sweetalert2'


export const App = () => {
  const [data, setData] = useState([]); // Almacenar los datos del endpoint
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el mensaje de carga

  const printModal = (item) => {
    Swal.fire({
      title: item.messageId,
      text: item.message,
      confirmButtonColor: '#3085d6',
    });
  }


  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data'); // 'Data' es el nombre de la hoja

    XLSX.writeFile(wb, 'datos.xlsx'); // Nombre del archivo
  };

  useEffect(() => {
    // Realizar la solicitud para obtener los datos
    setData([]); // Limpiar los datos
    fetch('https://pjerj5feq2.execute-api.us-east-1.amazonaws.com/getMessages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Solucionar el error de CORS
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Almacenar los datos en el estado
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, [isLoading]);

  return (

    <div className="container mx-auto p-4 mt-5">
      <h1 className="text-3xl mb-4 text-center font-bold text-gray-600">Prueba tecnica XUM - Ingeniero Cloud</h1>
      <h2 className="text-2xl mb-4 text-center font-bold text-gray-600">Reporteria de mensajes</h2>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-4"
        onClick={() => setIsLoading(!isLoading)}
      >

        <div className="flex justify-center items-center">
          <BsArrowRepeat />
          <p className="ml-2">Refrescar</p>
        </div>
      </button>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={exportToExcel}
      >
        <div className="flex justify-center items-center">
          <PiMicrosoftExcelLogo />
          <p className="ml-2">Exportar</p>
        </div>
      </button>
      <hr className='mb-5' />
      <div className="table-responsive">
        <table className="min-w-full bg-white border-separate border border-gray-300 ">
          <thead>
            <tr>
              <th className="bg-gray-100 text-gray-600">MessageID</th>
              <th className="bg-gray-100 text-gray-600">Sender</th>
              <th className="bg-gray-100 text-gray-600">Msisdn</th>
              <th className="bg-gray-100 text-gray-600">Datetime</th>
              <th className="bg-gray-100 text-gray-600">Accion</th>
            </tr>
          </thead>
          <tbody>
            {
              data.length == 0 ? <tr><td colSpan="5" className="text-center">Obteniendo Datos...</td></tr> :
                data.map((item, index) => (
                  <tr key={index} className='hover:bg-gray-300'>
                    <td className="border border-gray-300 p-2">{item.messageId}</td>
                    <td className="border border-gray-300 p-2">{item.sender}</td>
                    <td className="border border-gray-300 p-2">{item.msisdn}</td>
                    <td className="border border-gray-300 p-2">{item.datetime}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => printModal(item)}
                      >
                        <div className="flex justify-center items-center">
                          <BiMessageAltDetail />
                          <p className="ml-2">Ver Mensaje</p>
                        </div>
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>


  )
}
