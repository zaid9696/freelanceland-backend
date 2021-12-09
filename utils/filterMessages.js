
const filterMessages = (allMessages, user) => {
  
	// Removing all the sent messages
	const sender = Array.from(new Set(allMessages.map(item => item.sender.userName).map(id =>  allMessages.find(elem => elem.sender.userName == id))));
	// Removing all the received messages
	const receiver = Array.from(new Set(allMessages.map(item => item.receiver.userName).map(id =>  allMessages.find(elem => elem.receiver.userName == id))));



	// Filtering out some duplicate received messages
	let filterdReceivedArr = [];
	receiver.map(item => {

		if(filterdReceivedArr.length !== 0){

			const arCount = filterdReceivedArr.length - 1;
			if(filterdReceivedArr[arCount].sender.userName !== item.receiver.userName){
				return filterdReceivedArr.push(item)
			}
			return item
		}

		return filterdReceivedArr.push(item)

	})


	// Combining the two arrays
	const conbinedArr = sender.concat(filterdReceivedArr);

	// Counting all unread messages
	const countUnread = {};
    allMessages.reduce((prev, item) => {

		if(!item.read && item.sender.id !== user.id){
		let currentUser
		 item.sender.userName == user.userName ? currentUser = item.receiver.userName : currentUser = item.sender.userName;

		if(!countUnread[currentUser]){
			countUnread[currentUser] = 1;
		}else {

			countUnread[currentUser]++; 
		}
	}

	return item;

    	},0)

// Combining unread messages count and the lateset messages
    const usersMessages = {};

	conbinedArr.map(item => {
		
	let name;
	item.sender.userName == user.userName ? name = item.receiver.userName : name = item.sender.userName;

	usersMessages[name] = {item, countUnread:countUnread[name]};
	});

	return usersMessages;
}


module.exports = filterMessages;