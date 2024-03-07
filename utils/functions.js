function  customSort(a, b) {
  const nameA = parseInt(a.name);
  const nameB = parseInt(b.name);
  
  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  } else {
    return 0;
  }
}

function groupAndSort(source) {
  const groupedCircuits = source.reduce((groups, item) => {
    const { name, circuit } = item; 

    if (!groups[circuit]) {
      groups[circuit] = { circuit, names: [] };
    }
    
    groups[circuit].names.push(name); 
    
    return groups;
  }, {});

  const sortedData = Object.values(groupedCircuits).map(item => ({
    name: item.circuit,
    value: item.names
  })).sort((a,b) => customSort(a,b));

  return sortedData;
}

export {
  groupAndSort
}