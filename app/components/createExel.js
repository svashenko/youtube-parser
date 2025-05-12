import * as xlsx from 'xlsx';

function createExel(exelPath) {
  try {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet([[
      'Number',
      'Language',
      'Author_Name',
      'Name',
      'Length',
      'Description',
      'Views',
      'Likes',
      'Comments',
      'Date',
      'Video_File',
      'Preview_File',
      'Author_Picture_File',
      'Followers',
      'Genre',
    ]]);

    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    xlsx.writeFile(workbook, exelPath);

    console.log('Exel File has been created!');
    
    return workbook;
  } catch (error) {
    console.log('Error creating exel file: ', error.message);
  }
}

export default createExel;