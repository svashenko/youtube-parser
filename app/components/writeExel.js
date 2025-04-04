import pkg from 'xlsx';
const { utils, writeFile } = pkg;

async function writeExel(workbook, data, exelPath) {
  try {
    const worksheet = workbook.Sheets['Sheet1'];
    const existingData = utils.sheet_to_json(worksheet, { header: 1 });

    existingData.push(Object.values(data));

    const updatedWorksheet = utils.aoa_to_sheet(existingData);
    workbook.Sheets['Sheet1'] = updatedWorksheet;
    writeFile(workbook, exelPath);

    console.log('Data has been writen!');
  } catch (error) {
    console.log('Error writing to exel file: ', error.message);
  }
}

export default writeExel;