interface IProps {
  ownerFirstName: string;
  ownerPhoneNumber: string;
}

function PostContactDetails({ ownerFirstName, ownerPhoneNumber }: IProps) {
  return (
    <div className="post-owner-contact-details">
      <p>Contact name: {ownerFirstName}</p>
      <p>Phone number: {ownerPhoneNumber}</p>
    </div>
  );
}

export default PostContactDetails;
