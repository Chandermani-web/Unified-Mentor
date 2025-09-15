
        // Game state variables
        let currentPlayer = 'X';
        let gameBoard = ['', '', '', '', '', '', '', '', ''];
        let gameActive = true;
        
        // DOM elements
        const statusDisplay = document.getElementById('status');
        const cells = document.querySelectorAll('.cell');
        const resetButton = document.getElementById('resetButton');
        
        // Winning combinations (indices of cells)
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        // Messages for game status
        const winMessage = () => `Player ${currentPlayer} wins!`;
        const drawMessage = () => `Game ended in a draw!`;
        const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;
        
        // Set status display
        statusDisplay.innerHTML = currentPlayerTurn();
        
        // Handle cell click
        function handleCellClick(clickedCellEvent) {
            const clickedCell = clickedCellEvent.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
            
            // Check if cell is already played or game is not active
            if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
                return;
            }
            
            // Process the cell click
            gameBoard[clickedCellIndex] = currentPlayer;
            clickedCell.innerHTML = currentPlayer;
            clickedCell.classList.add(currentPlayer.toLowerCase());
            
            // Check for win or draw
            checkResult();
        }
        
        // Check game result
        function checkResult() {
            let roundWon = false;
            let winningLine = null;
            
            // Check all winning conditions
            for (let i = 0; i < winningConditions.length; i++) {
                const [a, b, c] = winningConditions[i];
                if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                    roundWon = true;
                    winningLine = winningConditions[i];
                    break;
                }
            }
            
            if (roundWon) {
                // Highlight winning cells
                winningLine.forEach(index => {
                    cells[index].classList.add('win');
                });
                
                statusDisplay.innerHTML = winMessage();
                gameActive = false;
                return;
            }
            
            // Check for draw
            let roundDraw = !gameBoard.includes('');
            if (roundDraw) {
                statusDisplay.innerHTML = drawMessage();
                gameActive = false;
                return;
            }
            
            // Continue game with next player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusDisplay.innerHTML = currentPlayerTurn();
        }
        
        // Reset game
        function resetGame() {
            currentPlayer = 'X';
            gameBoard = ['', '', '', '', '', '', '', '', ''];
            gameActive = true;
            statusDisplay.innerHTML = currentPlayerTurn();
            
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.classList.remove('x', 'o', 'win');
            });
        }
        
        // Event listeners
        cells.forEach(cell => cell.addEventListener('click', handleCellClick));
        resetButton.addEventListener('click', resetGame);