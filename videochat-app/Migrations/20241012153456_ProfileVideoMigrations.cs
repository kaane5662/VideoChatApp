using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace videochat_app.Migrations
{
    /// <inheritdoc />
    public partial class ProfileVideoMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // migrationBuilder.AlterColumn<string[]>(
            //     name: "Frameworks",
            //     table: "Profiles",
            //     type: "text[]",
            //     nullable: true,
            //     oldClrType: typeof(string[]),
            //     oldType: "text[]");

            migrationBuilder.AddColumn<int>(
                name: "Matches",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Sessions",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Matches",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "Sessions",
                table: "Profiles");

            // migrationBuilder.AlterColumn<string[]>(
            //     name: "Frameworks",
            //     table: "Profiles",
            //     type: "text[]",
            //     nullable: false,
            //     defaultValue: new string[0],
            //     oldClrType: typeof(string[]),
            //     oldType: "text[]",
            //     oldNullable: true);
        }
    }
}
