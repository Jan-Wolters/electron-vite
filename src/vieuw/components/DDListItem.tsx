function dbList() {
  return (
    <ul className="list-group">
      <li className="list-group-item">
        <div className="container">
          <div className="row">
            <div className="col-sm text-center border border-dark bg-info">
              <h1>back-ups</h1>
              <div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">back-ups 1</li>
                </ul>
              </div>
            </div>
            <div className="col-sm text-center border border-dark bg-info">
              <h1>netwerk</h1>
              <div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">back-ups 1</li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                  <li className="list-group-item">Morbi leo risus</li>
                  <li className="list-group-item">Porta ac consectetur ac</li>
                  <li className="list-group-item">Vestibulum at hallo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
}
export { dbList };
